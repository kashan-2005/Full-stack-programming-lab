import React from 'react';

const StepCheckout = ({ formData, updateForm, nextStep, prevStep }) => {
  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="animate-fade-in w-full pb-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">Set up Direct Debit for membership renewal</h2>
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        
        {/* Basic Info Section */}
        <div>
          <h3 className="talyllyn-section-header">Your Basic Info</h3>
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="talyllyn-label">Title <span className="asterisk">*</span></label>
            <div className="flex items-center gap-2">
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="talyllyn-input w-24" />
              {formData.title && <span className="text-green-500 bg-[#e6f4ea] rounded-full w-5 h-5 flex items-center justify-center border border-green-200">✓</span>}
            </div>
            
            <label className="talyllyn-label">First name(s) <span className="asterisk">*</span></label>
            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Last name <span className="asterisk">*</span></label>
            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="talyllyn-input" />
          </div>
        </div>

        {/* Contact Details Section */}
        <div>
          <h3 className="talyllyn-section-header mt-8">Your contact details</h3>
          <p className="text-sm text-gray-600 mb-4 px-2">Please provide your telephone number (including area code) and your email address.</p>
          <div className="grid grid-cols-[180px_1fr] gap-4 items-center">
            <label className="talyllyn-label">Contact number <span className="asterisk">*</span></label>
            <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Alternative contact number</label>
            <input type="tel" name="altNumber" value={formData.altNumber} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Email address <span className="asterisk">*</span></label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Confirm email address <span className="asterisk">*</span></label>
            <input required type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} className="talyllyn-input" />
          </div>
        </div>

        {/* Account Address Section */}
        <div>
          <h3 className="talyllyn-section-header mt-8">Your account address</h3>
          <p className="text-sm text-gray-600 mb-4 px-2">Please provide your Bank Account address..</p>
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="talyllyn-label">Postcode <span className="asterisk">*</span></label>
            <div className="flex gap-4">
              <input required type="text" name="postcode" value={formData.postcode} onChange={handleChange} className="talyllyn-input w-24" />
              <input type="text" disabled className="talyllyn-input w-24 bg-gray-100 cursor-not-allowed" />
            </div>
            
            <label className="talyllyn-label">Address line 1 <span className="asterisk">*</span></label>
            <input required type="text" name="address1" value={formData.address1} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Address line 2</label>
            <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Town <span className="asterisk">*</span></label>
            <input required type="text" name="town" value={formData.town} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">County</label>
            <input type="text" name="county" value={formData.county} onChange={handleChange} className="talyllyn-input" />
          </div>
        </div>

        {/* Bank Details Section */}
        <div>
          <h3 className="talyllyn-section-header mt-8">Your bank details</h3>
          <p className="text-sm text-gray-400 mb-4 px-2">This is the bank account from where the Direct Debit payments will be taken.</p>
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="talyllyn-label">Account holder name <span className="asterisk">*</span></label>
            <input required type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="talyllyn-input" />
            
            <label className="talyllyn-label">Sort code <span className="asterisk">*</span></label>
            <div className="flex gap-2 w-48">
              <input required type="text" maxLength="2" name="sortCode1" value={formData.sortCode1} onChange={handleChange} className="talyllyn-input text-center" />
              <input required type="text" maxLength="2" name="sortCode2" value={formData.sortCode2} onChange={handleChange} className="talyllyn-input text-center" />
              <input required type="text" maxLength="2" name="sortCode3" value={formData.sortCode3} onChange={handleChange} className="talyllyn-input text-center" />
            </div>
            
            <label className="talyllyn-label">Account number <span className="asterisk">*</span></label>
            <input required type="text" maxLength="8" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="talyllyn-input w-48" />
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-4">
          <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
            Back
          </button>
          <button type="submit" className="talyllyn-btn">
            Check Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepCheckout;
