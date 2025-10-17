'use client';

import SimpleRegistrationForm from '../SimpleRegistrationForm';

export default function SimplifiedRegisterPage() {
  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Register for a Bootcamp</h1>
      <p className="mb-8 text-center text-gray-600">
        Fill out the form below to register for one of our bootcamp programs.
      </p>
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <SimpleRegistrationForm />
      </div>
    </div>
  );
}