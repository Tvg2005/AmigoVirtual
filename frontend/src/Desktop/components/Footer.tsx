import React from "react";

const Footer: React.FC = () =>{ return( 
<footer className="bg-gray-800 text-white py-6 mt-8">
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h4 className="font-semibold mb-4">Contato e Suporte</h4>
      <p>Email: suporte@exemplo.com</p>
      <p>Telefone: (11) 1234-5678</p>
    </div>
    <div>
      <h4 className="font-semibold mb-4">Links Úteis</h4>
      <ul>
        <li><a href="#" className="hover:text-blue-300">Política de Privacidade</a></li>
        <li><a href="#" className="hover:text-blue-300">Termos de Uso</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold mb-4">Redes Sociais</h4>
      <div className="flex gap-4">
        <a href="#" className="hover:text-blue-300">Facebook</a>
        <a href="#" className="hover:text-blue-300">Instagram</a>
      </div>
    </div>
  </div>
</div>
</footer>)}

export default Footer;