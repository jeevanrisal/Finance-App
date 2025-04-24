import React from 'react';

const AssetsStep = ({ data, setData, onNext, onBack }) => {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleAddAnother = () => {
    setData([...data, { type: '', description: '', value: '', ownership: '' }]);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800'>Add Assets</h2>

      {data.map((asset, index) => (
        <div
          key={index}
          className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border p-4 rounded-lg shadow-sm'
        >
          <input
            type='text'
            placeholder='Asset Type (e.g., Property)'
            value={asset.type}
            onChange={(e) => handleChange(index, 'type', e.target.value)}
            className='input'
          />
          <input
            type='text'
            placeholder='Description'
            value={asset.description}
            onChange={(e) => handleChange(index, 'description', e.target.value)}
            className='input'
          />
          <input
            type='number'
            placeholder='Estimated Value'
            value={asset.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            className='input'
          />
          <input
            type='number'
            placeholder='Ownership %'
            value={asset.ownership}
            onChange={(e) => handleChange(index, 'ownership', e.target.value)}
            className='input'
          />
        </div>
      ))}

      <button
        onClick={handleAddAnother}
        className='text-purple-600 hover:underline font-medium'
      >
        + Add Another
      </button>

      <div className='flex justify-between mt-4'>
        <button
          onClick={onBack}
          className='bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400'
        >
          Back
        </button>
        <button
          onClick={onNext}
          className='bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssetsStep;
