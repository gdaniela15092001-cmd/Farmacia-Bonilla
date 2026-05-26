/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Branch, WellnessTip, FAQ } from './types';

export const productsData: Product[] = [
  // Category: medicamentos
  {
    id: 'm1',
    name: 'Paracetamol Bonilla 500mg',
    brand: 'Laboratorios Bonilla',
    category: 'medicamentos',
    categoryLabel: 'Medicamentos',
    price: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: 'Eficaz analgésico y antipirético. Indicado para el tratamiento de síntomas de dolor leve a moderado y fiebre.',
    requiresPrescription: false,
    activeIngredient: 'Paracetamol',
    dosage: '1 tableta cada 8 horas (máximo 4g al día)',
    stock: 120
  },
  {
    id: 'm2',
    name: 'Amoxicilina 500mg',
    brand: 'GenFar',
    category: 'medicamentos',
    categoryLabel: 'Medicamentos',
    price: 320,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80',
    description: 'Antibiótico de amplio espectro para el tratamiento de infecciones bacterianas comunes. Requiere receta médica válida.',
    requiresPrescription: true,
    activeIngredient: 'Amoxicilina Trihidrato',
    dosage: '1 cápsula cada 8 horas por 7 días',
    stock: 45
  },
  {
    id: 'm3',
    name: 'Ibuprofeno 400mg',
    brand: 'Ibuprex',
    category: 'medicamentos',
    categoryLabel: 'Medicamentos',
    price: 180,
    image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=500&auto=format&fit=crop&q=80',
    description: 'Antiinflamatorio no esteroideo (AINE) con propiedades analgésicas y antipiréticas para dolores articulares, musculares o de cabeza.',
    requiresPrescription: false,
    activeIngredient: 'Ibuprofeno',
    dosage: '1 tableta con alimentos cada 6-8 horas',
    stock: 90
  },
  {
    id: 'm4',
    name: 'Loratadina 10mg Antialérgico',
    brand: 'Clarityne',
    category: 'medicamentos',
    categoryLabel: 'Medicamentos',
    price: 210,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80',
    description: 'Antihistamínico no sedante de acción prolongada. Alivio eficaz de los síntomas de alergia estacional y rinitis.',
    requiresPrescription: false,
    activeIngredient: 'Loratadina',
    dosage: '1 tableta diaria, de preferencia por la mañana',
    stock: 75
  },

  // Category: cuidado_personal
  {
    id: 'c1',
    name: 'Bloqueador Solar FPS 50+ Gel',
    brand: 'La Roche-Posay',
    category: 'cuidado_personal',
    categoryLabel: 'Cuidado Personal',
    price: 540,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
    description: 'Protector solar facial de amplio espectro tipo toque seco. Ideal para pieles grasas o con tendencia acnéica. Resistente al agua.',
    requiresPrescription: false,
    dosage: 'Aplicar abundantemente 30 minutos antes de la exposición y retocar cada 3 horas.',
    stock: 30
  },
  {
    id: 'c2',
    name: 'Crema Hidratante Cerave 454g',
    brand: 'CeraVe',
    category: 'cuidado_personal',
    categoryLabel: 'Cuidado Personal',
    price: 490,
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&auto=format&fit=crop&q=80',
    description: 'Desarrollada con dermatólogos, ayuda a restaurar la barrera protectora de la piel del rostro y cuerpo con 3 ceramidas esenciales.',
    requiresPrescription: false,
    dosage: 'Aplicar diariamente en rostro y cuerpo sobre la piel limpia.',
    stock: 40
  },
  {
    id: 'c3',
    name: 'Gel Limpiador Effaclar 400ml',
    brand: 'La Roche-Posay',
    category: 'cuidado_personal',
    categoryLabel: 'Cuidado Personal',
    price: 460,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    description: 'Purifica suavemente la piel, elimina las impurezas y el exceso de sebo, dejando la piel limpia y fresca.',
    requiresPrescription: false,
    dosage: 'Hacer espuma con un poco de agua y masajear con suavidad, luego enjuagar.',
    stock: 25
  },

  // Category: bienestar
  {
    id: 'b1',
    name: 'Multivitamínico Bonilla Vital-Plus',
    brand: 'Laboratorios Bonilla',
    category: 'bienestar',
    categoryLabel: 'Bienestar & Nutrición',
    price: 290,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
    description: 'Fórmula balanceada con 12 vitaminas y 10 minerales esenciales para recargar energía, mejorar el sistema inmune y combatir la fatiga.',
    requiresPrescription: false,
    dosage: 'Tomar 1 cápsula con el desayuno.',
    stock: 150
  },
  {
    id: 'b2',
    name: 'Omega 3 Premium 1000mg',
    brand: 'Solgar',
    category: 'bienestar',
    categoryLabel: 'Bienestar & Nutrición',
    price: 380,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
    description: 'Ácidos grasos esenciales EPA y DHA purificados libres de mercurio. Promueve la salud cardiovascular y cognitiva.',
    requiresPrescription: false,
    dosage: 'Tomar 1 o 2 cápsulas diarias con alimentos.',
    stock: 60
  },
  {
    id: 'b3',
    name: 'Colágeno Hidrolizado + Vitamina C',
    brand: 'GNC',
    category: 'bienestar',
    categoryLabel: 'Bienestar & Nutrición',
    price: 480,
    image: 'https://images.unsplash.com/photo-1577401230592-d304da0c04fc?w=500&auto=format&fit=crop&q=80',
    description: 'Polvo de colágeno de fácil disolución. Ideal para fortalecer articulaciones, huesos, cabello, uñas y elasticidad de la piel.',
    requiresPrescription: false,
    dosage: 'Disolver 1 cucharada dosificadora en agua o batidos por la mañana.',
    stock: 55
  },

  // Category: infantil
  {
    id: 'i1',
    name: 'Leche de Fórmula Nan Optipro 1',
    brand: 'Nestlé',
    category: 'infantil',
    categoryLabel: 'Bebés & Mamá',
    price: 420,
    image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=500&auto=format&fit=crop&q=80',
    description: 'Fórmula láctea de inicio para lactantes sanos desde el nacimiento hasta los 6 meses. Fortificada con hierro y nutrientes esenciales.',
    requiresPrescription: false,
    dosage: 'Según indicación del pediatra o instructivo de preparación en lata.',
    stock: 35
  },
  {
    id: 'i2',
    name: 'Crema antipañalitis Desitin 113g',
    brand: 'Desitin',
    category: 'infantil',
    categoryLabel: 'Bebés & Mamá',
    price: 190,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Crema con 40% de óxido de zinc para prevenir y tratar la dermatitis del pañal. Alivio inmediato y protección de larga duración.',
    requiresPrescription: false,
    dosage: 'Aplicar una capa generosa en cada cambio de pañal.',
    stock: 80
  },

  // Category: botiquin
  {
    id: 'bt1',
    name: 'Alcohol Etílico Isopropílico 70% 500ml',
    brand: 'Bonilla Protect',
    category: 'botiquin',
    categoryLabel: 'Botiquín & Primeros Auxilios',
    price: 65,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
    description: 'Antiséptico de uso externo para curación y desinfección de superficies y manos. Esencial para el botiquín del hogar.',
    requiresPrescription: false,
    dosage: 'Aplicar con una gasa esterilizada según necesidad.',
    stock: 200
  },
  {
    id: 'bt2',
    name: 'Caja de Curitas Elásticas 50 pzas',
    brand: 'Band-Aid',
    category: 'botiquin',
    categoryLabel: 'Botiquín & Primeros Auxilios',
    price: 95,
    image: 'https://images.unsplash.com/photo-1590156546746-c58d24b6e510?w=500&auto=format&fit=crop&q=80',
    description: 'Apósitos protectores elásticos y transpirables para heridas pequeñas o raspaduras. Adhesivo de larga duración.',
    requiresPrescription: false,
    dosage: 'Limpiar y secar la herida antes de aplicar el apósito.',
    stock: 140
  },
  {
    id: 'bt3',
    name: 'Gasa Estéril de Algodón 10x10cm (10 sobres)',
    brand: 'Bonilla Protect',
    category: 'botiquin',
    categoryLabel: 'Botiquín & Primeros Auxilios',
    price: 85,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
    description: 'Gasa altamente absorbente, 100% algodón, estéril. Ideal para el cuidado de heridas, limpieza y aplicar tratamientos tópicos.',
    requiresPrescription: false,
    dosage: 'Uso externo para cubrimiento y limpieza de heridas.',
    stock: 110
  }
];

export const branchesData: Branch[] = [
  {
    id: 'b-centro',
    name: 'Sucursal Centro (Matriz)',
    address: 'Av. Manuel de la Cruz Rosales #104, Centro Histórico',
    phone: '+52 (55) 4123-4567',
    hours: 'Lun - Sáb: 7:00 AM - 10:00 PM | Dom: 8:00 AM - 8:00 PM',
    is24Hours: false,
    isOnDuty: true, // Hoy de turno
    coords: { lat: 19.432608, lng: -99.133209 }
  },
  {
    id: 'b-norte',
    name: 'Sucursal Lindavista',
    address: 'Calzada de los Médicos #802, Colonia Lindavista',
    phone: '+52 (55) 4123-4568',
    hours: 'Lun - Dom: Abierto las 24 horas',
    is24Hours: true,
    isOnDuty: false,
    coords: { lat: 19.491234, lng: -99.123456 }
  },
  {
    id: 'b-sur',
    name: 'Sucursal Coyoacán',
    address: 'Av. Miguel Ángel de Quevedo #450, Barrio Santa Catarina',
    phone: '+52 (55) 4123-4569',
    hours: 'Lun - Sáb: 8:00 AM - 11:00 PM | Dom: 9:00 AM - 9:00 PM',
    is24Hours: false,
    isOnDuty: false,
    coords: { lat: 19.349876, lng: -99.162345 }
  }
];

export const wellnessTipsData: WellnessTip[] = [
  {
    id: 't1',
    title: 'La importancia de la Protección Solar diaria',
    category: 'Cuidado de la Piel',
    content: 'La radiación ultravioleta penetra las nubes e influye todo el año, no solo en verano. Usar bloqueador solar FPS 50+ es el hábito número uno para prevenir el envejecimiento prematuro, manchas y el cáncer de piel. Aplícalo de mañana y vuélvelo a aplicar al mediodía.',
    recommendedProducts: ['c1', 'c2']
  },
  {
    id: 't2',
    title: 'Cómo reforzar tus defensas este invierno',
    category: 'Nutrición & Inmunidad',
    content: 'Mantener un sistema inmune robusto requiere descanso adecuado, hidratación continua y vitaminas clave. La vitamina C, D y el zinc favorecen la maduración de las células de defensa. Consumir frutas cítricas y suplementos balanceados previene resfriados severos.',
    recommendedProducts: ['b1', 'b3', 'm4']
  },
  {
    id: 't3',
    title: 'Dermatitis del pañal: cuidado y prevención',
    category: 'Pediatría',
    content: 'La colita del bebé es sumamente sensible. Humedad, fricción y contacto con ácidos dañan su barrera cutánea. Se recomienda cambiar el pañal con frecuencia, limpiar con agua tibia sin jabones agresivos y aplicar cremas protectoras ricas en óxido de zinc que actúan como una barrera aislante.',
    recommendedProducts: ['i2', 'i1']
  }
];

export const faqsData: FAQ[] = [
  {
    question: '¿Puedo comprar medicamentos de venta bajo receta en línea?',
    answer: 'Sí. Para medicamentos antibióticos u otros controlados que requieren receta formal, nuestro sitio web te permite cargar una foto o PDF de la receta. Un farmacéutico certificado de Farmacia Bonilla la validará antes de preparar tu pedido de entrega a domicilio o retiro en sucursal.'
  },
  {
    question: '¿Qué significa que una sucursal esté "De Turno"?',
    answer: 'Las farmacias de turno ofrecen atención continuada de urgencia durante la noche y días feriados cuando otros establecimientos están cerrados. En Farmacia Bonilla, nos rotamos legislativamente para garantizarte siempre al menos una sucursal disponible de emergencia las 24 horas.'
  },
  {
    question: '¿Tienen servicio de entrega a domicilio y cuál es el costo?',
    answer: 'Contamos con servicio de delivery exprés a través de nuestros repartidores propios en un radio de 5km de cada sucursal. El costo es de $35 pesos, pero en compras mayores a $300 pesos o al adquirir suplementos de la marca Bonilla, ¡el envío es completamente gratuito!'
  },
  {
    question: '¿Ofrecen descuentos para adultos mayores o pacientes crónicos?',
    answer: 'Sí. En Farmacia Bonilla valoramos tu bienestar. Con nuestro "Programa Vivir Mejor" ofrecemos un 10% de descuento constante en medicamentos seleccionados para la hipertensión, diabetes, salud cardíaca y a todos los adultos mayores de 60 años con identificación oficial.'
  }
];
