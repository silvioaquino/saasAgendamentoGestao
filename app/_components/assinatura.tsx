"use client"
// components/PremiumSubscription.js
export default function PremiumSubscription() {
  const kiwifyLink = "https://kiwify.com/seulinkdaassinatura"; // Substitua pelo seu link real

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">Assinatura Premium</h2>
      <p className="mb-4">Tenha benefícios exclusivos com nossa assinatura mensal!</p>
      
      <ul className="list-disc pl-5 mb-6">
        <li>1 agendamento garantido por semana</li>
        <li>10% de desconto em todos os serviços</li>
        <li>Produtos exclusivos com desconto</li>
        <li>Prioridade nos horários mais concorridos</li>
      </ul>
      
      <div className="bg-white p-4 rounded-lg mb-4">
        <p className="text-gray-800 font-semibold">R$ 99,90/mês</p>
      </div>
      
      <a
        href={kiwifyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg inline-block transition duration-300"
      >
        Assinar Agora
      </a>
    </div>
  );
}