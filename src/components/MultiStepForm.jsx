import React, { useState } from 'react';
import StepApplication from './steps/StepApplication';
import StepCheckout from './steps/StepCheckout';
import StepSuccess from './steps/StepSuccess';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Application
    isRenewal: false,
    members: [{ title: '', initials: '', forename: '', surname: '', dob: '', class: '', code: '', amount: '' }],
    donation: '',
    totalAmount: '',
    giftAid: false,
    // Step 2: Checkout (Direct Debit)
    title: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    altNumber: '',
    email: '',
    confirmEmail: '',
    postcode: '',
    address1: '',
    address2: '',
    town: '',
    county: '',
    accountHolder: '',
    sortCode1: '',
    sortCode2: '',
    sortCode3: '',
    accountNumber: ''
  });

  const updateForm = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepApplication formData={formData} updateForm={updateForm} nextStep={nextStep} />;
      case 2:
        return <StepCheckout formData={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StepSuccess />;
      default:
        return null;
    }
  };

  return (
    <div className="talyllyn-modal pt-0 pb-12 mb-16">
      {/* Red header stripe */}
      <div className="talyllyn-header-bar"></div>
      
      {/* Circular Logo Area */}
      <div className="talyllyn-logo-container relative z-10 mb-8 mt-6">
        <div className="w-28 h-28 rounded-full border-2 border-gray-100 flex items-center justify-center bg-gray-50 overflow-hidden text-center text-xs text-gray-400">
          <img 
            src="/talyllyn-logo.png" 
            alt="Talyllyn Railway Company Logo" 
            className="w-full h-full object-cover scale-[1.15]"
            onError={(e) => {
              e.target.style.display='none';
              e.target.nextSibling.style.display='block';
            }}
          />
          <span style={{display: 'none'}}>Logo Here<br/>(talyllyn-logo.png)</span>
        </div>
      </div>

      {/* Form Content Wrapper */}
      <div className="w-full px-8 md:px-16 z-10">
        {renderStep()}
      </div>
    </div>
  );
};

export default MultiStepForm;
