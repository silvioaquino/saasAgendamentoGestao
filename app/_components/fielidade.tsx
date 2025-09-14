"use client"
// components/FidelityProgramSignup.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FidelityProgramSignup() {
  const { data: session } = useSession();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!acceptedTerms) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/fidelity/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });
      
      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error signing up for fidelity program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <p>Você aderiu com sucesso ao nosso programa de fidelidade!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Programa de Fidelidade</h2>
      <p className="mb-4">
        Junte pontos a cada serviço realizado e troque por benefícios exclusivos!
      </p>
      
      <ul className="list-disc pl-5 mb-4">
        <li>1 ponto por cada serviço concluído</li>
        <li>10 pontos: Corte gratuito</li>
        <li>5 pontos: Desconto de 20% no próximo serviço</li>
        <li>Pontos confirmados pelo barbeiro após o serviço</li>
      </ul>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mr-2"
          />
          <span>Eu concordo com os termos do programa de fidelidade</span>
        </label>
      </div>
      
      <button
        onClick={handleSignup}
        disabled={!acceptedTerms || isLoading || !session}
        className={`py-2 px-4 rounded ${(!acceptedTerms || isLoading || !session) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {isLoading ? 'Processando...' : 'Aderir ao Programa'}
      </button>
      
      {!session && (
        <p className="mt-2 text-red-500">Por favor, faça login para aderir ao programa.</p>
      )}
    </div>
  );
}