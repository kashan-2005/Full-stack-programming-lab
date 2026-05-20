/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: controllers/newsController.js - News Headlines controller
 */

const axios = require("axios");

// ISO 3166-1 alpha-2 country codes supported by NewsAPI
const validCountryCodes = new Set([
    "ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de", "eg", 
    "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "lt", "lv", "ma", 
    "mx", "my", "ng", "nl", "no", "nz", "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", 
    "si", "sk", "th", "tr", "tw", "ua", "us", "ve", "za"
]);

// Predefined mock articles database for fallback and local testing
const mockNewsDatabase = {
    us: [
        { title: "Tech Giants Announce Next-Gen AI Alliance", source: "TechCrunch", url: "https://techcrunch.com/ai-alliance", publishedAt: "2026-05-20T08:00:00Z" },
        { title: "Wall Street Rallies Amid Favorable Treasury Yields", source: "Bloomberg", url: "https://bloomberg.com/markets-rally", publishedAt: "2026-05-20T09:15:00Z" },
        { title: "NASA Mars Rover Discovers Ancient Streambed Carbonates", source: "NASA News", url: "https://nasa.gov/mars-stream", publishedAt: "2026-05-20T07:30:00Z" },
        { title: "NFL Draft: Top Quarterback Prospects Analyzed", source: "ESPN", url: "https://espn.com/nfl-draft-qbs", publishedAt: "2026-05-19T21:45:00Z" },
        { title: "Breakthrough in Solid-State Battery Storage for Electric Vehicles", source: "Wired", url: "https://wired.com/solidstate-batteries", publishedAt: "2026-05-20T10:00:00Z" },
        { title: "Deep Oceans Warming Faster Than Predicted, Study Finds", source: "Scientific American", url: "https://scientificamerican.com/ocean-warming", publishedAt: "2026-05-20T06:12:00Z" }
    ],
    gb: [
        { title: "UK Inflation Drops to 2.1% in April, Lowest in Four Years", source: "BBC News", url: "https://bbc.co.uk/news/uk-inflation", publishedAt: "2026-05-20T06:30:00Z" },
        { title: "Tate Modern Announces Major Summer Retro Exhibition", source: "The Guardian", url: "https://theguardian.com/art-tate-summer", publishedAt: "2026-05-20T09:00:00Z" },
        { title: "Premier League Transfer Window: Latest Signings & Rumors", source: "Sky Sports", url: "https://skysports.com/transfers-live", publishedAt: "2026-05-20T11:00:00Z" },
        { title: "London Fintech Startup Raises £50M Series B Funding", source: "Tech.eu", url: "https://tech.eu/london-fintech-50m", publishedAt: "2026-05-20T08:05:00Z" },
        { title: "New Green Transit System Proposed for Manchester", source: "Manchester Evening News", url: "https://manchestereveningnews.co.uk/transit", publishedAt: "2026-05-19T14:40:00Z" }
    ],
    in: [
        { title: "ISRO Successfully Places GSLV Meteorological Satellite in Orbit", source: "The Hindu", url: "https://thehindu.com/isro-gslv-launch", publishedAt: "2026-05-20T05:15:00Z" },
        { title: "Bengaluru Tech Hub Records Highest Seed Stage Investment in Q1", source: "Economic Times", url: "https://economictimes.indiatimes.com/investment-q1", publishedAt: "2026-05-20T07:45:00Z" },
        { title: "Indian Cricket Squad Announces Practice Roster for Border-Gavaskar Trophy", source: "Cricbuzz", url: "https://cricbuzz.com/ind-squad-practice", publishedAt: "2026-05-20T08:30:00Z" },
        { title: "Monsoon Forecast: Normal Rainfall Expected Across Peninsula", source: "Indian Express", url: "https://indianexpress.com/monsoon-forecast", publishedAt: "2026-05-20T09:50:00Z" },
        { title: "Unified Payments Interface (UPI) Transactions Hit New Peak", source: "Mint", url: "https://livemint.com/upi-peak-transactions", publishedAt: "2026-05-20T04:10:00Z" }
    ]
};

/**
 * GET /api/news/:country
 * Retrieves top headlines from NewsAPI filtered by country
 */
exports.getNews = async (req, res) => {
    const { country } = req.params;

    if (!country || country.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Bad Request: Country parameter is required."
        });
    }

    const cleanCountry = country.toLowerCase().trim();

    // Validate the country code against NewsAPI specifications
    if (!validCountryCodes.has(cleanCountry)) {
        return res.status(400).json({
            success: false,
            message: `Invalid country code '${country}'. NewsAPI supports the following ISO codes: ${Array.from(validCountryCodes).join(", ")}`
        });
    }

    const apiKey = process.env.NEWS_API_KEY;

    // Automatically trigger mock fallback if no API key is specified
    const isMockMode = !apiKey || apiKey === "your_news_api_key_here";

    if (isMockMode) {
        return getMockNews(cleanCountry, res, "Mock Data Mode (No API Key Configured)");
    }

    try {
        const newsUrl = `https://newsapi.org/v2/top-headlines?country=${cleanCountry}&apiKey=${apiKey}`;
        const response = await axios.get(newsUrl);

        if (response.data && response.data.articles) {
            // Transform and clean articles according to assignment specifications
            const formattedArticles = response.data.articles.map(article => ({
                title: article.title || "No Title",
                source: article.source ? article.source.name : "Unknown Source",
                url: article.url || "#",
                publishedAt: article.publishedAt || new Date().toISOString()
            }));

            // Slice list to limit between 5 and 10 items (Default: 8 items)
            const slicedArticles = formattedArticles.slice(0, 8);

            return res.status(200).json({
                success: true,
                count: slicedArticles.length,
                source: "NewsAPI Live Service",
                articles: slicedArticles
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Unexpected response structure from News API."
            });
        }

    } catch (error) {
        console.warn(`News API live call failed for '${cleanCountry}'. Reason:`, error.message);

        // Fall back to Mock articles for HTTP 401 Unauthorized or HTTP 429 Rate Limit
        if (error.response && (error.response.status === 401 || error.response.status === 429)) {
            return getMockNews(cleanCountry, res, `Mock Fallback (NewsAPI returned status ${error.response.status})`);
        }

        return res.status(500).json({
            success: false,
            message: "Failed to connect to external News API.",
            error: error.message
        });
    }
};

/**
 * Helper to fetch mock news headlines
 */
function getMockNews(country, res, sourceMessage) {
    const list = mockNewsDatabase[country];
    if (list) {
        return res.status(200).json({
            success: true,
            count: list.length,
            source: sourceMessage,
            articles: list
        });
    }

    // Generate dynamic mock headlines for other valid country codes
    const nameUpper = country.toUpperCase();
    const dynamicList = [
        { title: `National Summit Convened in ${nameUpper} Capital`, source: "Globe Wire", url: `https://globewire.com/${country}-summit`, publishedAt: new Date().toISOString() },
        { title: `New Economic Reforms Projected to Accelerate ${nameUpper} GDP Growth`, source: "Financial Post", url: `https://financialpost.com/${country}-gdp`, publishedAt: new Date(Date.now() - 3600000).toISOString() },
        { title: `${nameUpper} Researchers Announce breakthrough in Quantum Computing`, source: "Science Daily", url: `https://sciencedaily.com/${country}-quantum`, publishedAt: new Date(Date.now() - 7200000).toISOString() },
        { title: `Weather Warning Issued for Regions Across ${nameUpper}`, source: "Global Weather Network", url: `https://weather.com/${country}-alert`, publishedAt: new Date(Date.now() - 10800000).toISOString() },
        { title: `Major Tourism Revival Expected in ${nameUpper} this Quarter`, source: "Travel Gazette", url: `https://travelgazette.com/${country}-tourism`, publishedAt: new Date(Date.now() - 14400000).toISOString() }
    ];

    return res.status(200).json({
        success: true,
        count: dynamicList.length,
        source: sourceMessage,
        articles: dynamicList
    });
}
