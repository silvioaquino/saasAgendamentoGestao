"use client"
// components/Promotions.js
import { useState, useEffect } from 'react';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    validUntil: '',
    image: null
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se o usuário é admin (você precisa implementar essa lógica)
    checkAdminStatus();
    fetchPromotions();
  }, []);

  const checkAdminStatus = async () => {
    // Implemente a verificação do status de admin
    // setIsAdmin(true/false) baseado na resposta
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewPromotion({ ...newPromotion, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', newPromotion.title);
    formData.append('description', newPromotion.description);
    formData.append('validUntil', newPromotion.validUntil);
    if (newPromotion.image) {
      formData.append('image', newPromotion.image);
    }
    
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        fetchPromotions();
        setNewPromotion({
          title: '',
          description: '',
          validUntil: '',
          image: null
        });
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Promoções</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {promo.imageUrl && (
              <img 
                src={promo.imageUrl} 
                alt={promo.title} 
                className="w-full h-40 object-cover rounded-t-lg mb-3"
              />
            )}
            <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
            <p className="text-gray-700 mb-3">{promo.description}</p>
            <p className="text-sm text-gray-500">Válido até: {new Date(promo.validUntil).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      
      {isAdmin && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Adicionar Nova Promoção</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={newPromotion.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Descrição</label>
              <textarea
                name="description"
                value={newPromotion.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Válido até</label>
              <input
                type="date"
                name="validUntil"
                value={newPromotion.validUntil}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Imagem (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Adicionar Promoção
            </button>
          </form>
        </div>
      )}
    </div>
  );
}