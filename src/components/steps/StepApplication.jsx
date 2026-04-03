import React from 'react';

const StepApplication = ({ formData, updateForm, nextStep }) => {
  const membershipClasses = [
    { name: 'Ordinary Member', price: '£25' },
    { name: 'Senior (over 65)', price: '£20' },
    { name: 'Junior (under 21)', price: '£15' },
    { name: 'Associate', sub: '(spouse, partner or primary carer of a Life, Senior Life, Ordinary or Senior)', price: '£10' },
    { name: 'Associate Junior (under 21)', sub: '(child of a Life, Senior Life, Ordinary or Senior)', price: '£5' },
    { name: 'Life Member', price: '£500' },
    { name: 'Associate Life', sub: '(spouse or partner of Life or Senior Life)', price: '£250' },
    { name: 'Senior Life (over 65)', price: '£200' },
    { name: 'Associate Senior Life (over 65)', sub: '(spouse or partner of Life or Senior Life)', price: '£400' },
  ];

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    updateForm({ members: newMembers });
  };

  const addMember = () => {
    updateForm({ members: [...formData.members, { title: '', initials: '', forename: '', surname: '', dob: '', class: '', code: '', amount: '' }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="animate-fade-in w-full pb-8">
      <h2 className="text-xl font-bold mb-4">Talyllyn railway Preservation Society Membership application and renewal</h2>
      <p className="text-sm text-gray-600 mb-8 italic">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
      </p>

      <h3 className="font-bold mb-4">Talyllyn Railway Membership Classes 2015</h3>

      <div className="border border-gray-200 bg-gray-50 mb-8">
        {membershipClasses.map((cls, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-gray-200 last:border-0 hover:bg-gray-100 transition-colors">
            <div className="p-3">
              <span className="font-semibold text-sm">{cls.name}</span>
              {cls.sub && <p className="text-xs text-gray-500 mt-0.5">{cls.sub}</p>}
            </div>
            <div className="bg-[#b01c23] text-white font-bold p-3 w-16 text-center shrink-0">
              {cls.price}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-bold mb-2">Apply On-line</h3>
      <p className="text-sm text-gray-600 mb-6">
        Please enter membership for each person in the family then 'Add to cart' using the button below. you must then checkout to complete the purchase.
      </p>

      <div className="mb-6 flex items-center gap-2">
        <input 
          type="checkbox" 
          id="renewal" 
          checked={formData.isRenewal}
          onChange={(e) => updateForm({ isRenewal: e.target.checked })}
          className="w-4 h-4 text-[#8c171d] focus:ring-[#8c171d]"
        />
        <label htmlFor="renewal" className="text-[#8c171d] font-bold text-sm">Please tick the box if this is a renewal of membership</label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto mb-4 border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0c4a7c] text-white text-xs">
              <tr>
                <th className="p-2 border-r border-[#093458] font-normal">Title</th>
                <th className="p-2 border-r border-[#093458] font-normal">Initials</th>
                <th className="p-2 border-r border-[#093458] font-normal">Forename</th>
                <th className="p-2 border-r border-[#093458] font-normal">Surname</th>
                <th className="p-2 border-r border-[#093458] font-normal">Date of Birth</th>
                <th className="p-2 border-r border-[#093458] font-normal">Membership Class</th>
                <th className="p-2 border-r border-[#093458] font-normal">Membership Code</th>
                <th className="p-2 font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.members.map((member, idx) => (
                <tr key={idx} className="border-b border-gray-200 bg-white">
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.title} onChange={e => handleMemberChange(idx, 'title', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.initials} onChange={e => handleMemberChange(idx, 'initials', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.forename} onChange={e => handleMemberChange(idx, 'forename', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.surname} onChange={e => handleMemberChange(idx, 'surname', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input type="date" className="w-full border p-1 text-xs" value={member.dob} onChange={e => handleMemberChange(idx, 'dob', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.class} onChange={e => handleMemberChange(idx, 'class', e.target.value)} /></td>
                  <td className="p-1 border-r border-gray-200"><input className="w-full border p-1 text-xs" value={member.code} onChange={e => handleMemberChange(idx, 'code', e.target.value)} /></td>
                  <td className="p-1"><input className="w-full border p-1 text-xs" value={member.amount} onChange={e => handleMemberChange(idx, 'amount', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-start mb-8">
          <button type="button" onClick={addMember} className="bg-[#0c4a7c] text-white px-3 py-1 text-xs font-bold rounded flex items-center gap-1 hover:bg-[#093458]">
            <span className="text-sm leading-none">+</span> Add Another Member
          </button>

          <div className="text-right flex flex-col gap-2">
            <div className="flex items-center justify-end gap-2 text-sm font-bold">
              <span>Donation ( See note below) €</span>
              <input type="text" className="border border-gray-300 w-24 p-1" value={formData.donation} onChange={e => updateForm({donation: e.target.value})} />
            </div>
            <div className="flex items-center justify-end gap-2 text-sm font-bold uppercase">
              <span>Total Amount €</span>
              <input type="text" className="border border-gray-300 w-24 p-1" value={formData.totalAmount} onChange={e => updateForm({totalAmount: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-2">Note re Donations</h4>
            <p className="text-xs text-gray-500 leading-relaxed text-justify">
              Donations by Taxpayers to Talyllyn Holdings Ltd. under Gift Aid enable THL to recover tax. if you want your donation to be transferred to THL please sign below. By signing you confirm that you have paid or will pay an amount of Income Tax and/or Capital gains Tax for each tax year (6 april to 5 April) that is at least equal to the amount of tax that all the Charities or Community Amateur Sports Clubs (CASCs) that you donate to will reclaim on your gifts for that tax year. (Other taxes such as VAT and Council Tax do not qualify.) The owner of the credit/debit card being used to pay must be the person making the donation.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mt-2 italic">Note Subscription cannot be gift aided.</p>
          </div>
          
          <div className="w-48 shrink-0 flex flex-col items-end pt-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-6 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.giftAid}
                onChange={e => updateForm({ giftAid: e.target.checked })}
                className="w-4 h-4 border-gray-300 rounded text-[#0c4a7c] focus:ring-[#0c4a7c]"
              />
              Gift aid my donation
            </label>
            <button type="submit" className="talyllyn-btn w-full">
              Add to Cart
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StepApplication;
