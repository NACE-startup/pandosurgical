export type Language = 'en' | 'es' | 'zh';

export const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'es', label: 'Español', nativeLabel: 'ES' },
  { code: 'zh', label: '中文', nativeLabel: '中文' },
];

const translations: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    // Nav / header / global UI
    Product: 'Producto',
    LapRotator: 'LapRotator',
    'ENT Product': 'Producto ORL',
    Team: 'Equipo',
    News: 'Noticias',
    About: 'Nosotros',
    Company: 'Empresa',
    Investors: 'Inversionistas',
    Careers: 'Empleo',
    'Contact Us': 'Contáctanos',
    'Contact Us.': 'Contáctanos.',
    'Log in': 'Iniciar sesión',
    Dashboard: 'Panel',
    'Search...': 'Buscar...',
    Language: 'Idioma',
    Home: 'Inicio',
    Contact: 'Contacto',
    'No results found.': 'No se encontraron resultados.',
    Search: 'Buscar',
    'Close search': 'Cerrar búsqueda',
    'Change language': 'Cambiar idioma',
    'Main navigation': 'Navegación principal',
    'Mobile navigation': 'Navegación móvil',
    'Open dashboard': 'Abrir panel',
    'Open login': 'Abrir inicio de sesión',
    'Close navigation menu': 'Cerrar menú de navegación',
    'Open navigation menu': 'Abrir menú de navegación',

    // Homepage hero carousel
    'One-handed laparoscope rotation': 'Rotación laparoscópica con una sola mano',
    'Learn more': 'Más información',
    '2nd Place, USC Viterbi MFC': '2.º lugar, MFC de USC Viterbi',
    'We won the live pitch round with the LapRotator.': 'Ganamos la ronda de presentación en vivo con el LapRotator.',
    'Read more': 'Leer más',
    'Pando Surgical highlights': 'Destacados de Pando Surgical',
    'The LapRotator device': 'El dispositivo LapRotator',
    'Previous slide': 'Diapositiva anterior',
    'Next slide': 'Siguiente diapositiva',

    // VideoOverlay + Footer tagline
    'We are Pando Surgical': 'Somos Pando Surgical',
    'Est. 2025 | Making surgical tools equitable, efficient, and ergonomic.':
      'Fundada en 2025 | Creando herramientas quirúrgicas más equitativas, eficientes y ergonómicas.',

    // Mission
    'Our Mission': 'Nuestra Misión',
    'To make surgery more': 'Hacer que la cirugía sea más',
    equitable: 'equitativa',
    efficient: 'eficiente',
    and: 'y',
    ergonomic: 'ergonómica',
    'by developing tools that empower surgeons worldwide.': 'desarrollando herramientas que empoderen a cirujanos de todo el mundo.',
    'One-Handed': 'Una Sola Mano',
    'Laparoscope Rotation': 'Rotación del Laparoscopio',
    Universal: 'Universal',
    'System Compatibility': 'Compatibilidad de Sistemas',
    Ergonomic: 'Ergonómico',
    'Less Surgeon Fatigue': 'Menos Fatiga del Cirujano',
    'Quick Setup': 'Instalación Rápida',
    'Easy Attachment': 'Fácil Acoplamiento',

    // Product page hero + tabs
    'One-Handed Laparoscope Rotation': 'Rotación Laparoscópica con Una Sola Mano',
    'The LapRotator is an attachment on the laparoscope that gives surgeons full one-handed control over scope rotation during minimally invasive procedures.':
      'El LapRotator es un accesorio para el laparoscopio que le da al cirujano control total, con una sola mano, sobre la rotación del instrumento durante procedimientos mínimamente invasivos.',
    'By removing the need for a second hand or assistant to reposition the scope, it helps surgeons reduce fatigue during long procedures, mitigate safety hazards, and work more efficiently in the OR.':
      'Al eliminar la necesidad de una segunda mano o un asistente para reposicionar el instrumento, ayuda a los cirujanos a reducir la fatiga durante procedimientos largos, disminuir riesgos de seguridad y trabajar de forma más eficiente en el quirófano.',
    'See the Difference': 'Ve la Diferencia',
    'Features and Advantages': 'Características y Ventajas',
    Specifications: 'Especificaciones',
    'Detailed specifications are coming soon.': 'Las especificaciones detalladas estarán disponibles próximamente.',
    'LapRotator - See the Difference': 'LapRotator: Ve la Diferencia',
    'LapRotator V2 laparoscope rotation device render': 'Render del dispositivo de rotación laparoscópica LapRotator V2',
    'The LapRotator device mounted on a laparoscope': 'El dispositivo LapRotator montado en un laparoscopio',
    'View product image': 'Ver imagen del producto',
    'Previous product image': 'Imagen anterior del producto',
    'Next product image': 'Siguiente imagen del producto',

    // Comparison
    'Without LapRotator': 'Sin LapRotator',
    'With LapRotator V2': 'Con LapRotator V2',
    'Traditional laparoscopic surgery technique without LapRotator': 'Técnica quirúrgica laparoscópica tradicional sin LapRotator',
    'Laparoscopic surgery with LapRotator V2': 'Cirugía laparoscópica con LapRotator V2',

    // FeaturesAndAdvantages
    'Compatible with existing laparoscopic systems': 'Compatible con sistemas laparoscópicos existentes',
    'One-handed rotation for enhanced control': 'Rotación con una sola mano para un mejor control',
    'Compact and lightweight frame': 'Estructura compacta y liviana',
    'Simple user interface': 'Interfaz de usuario sencilla',
    'Designed to help reduce surgeon fatigue during procedures': 'Diseñado para ayudar a reducir la fatiga del cirujano durante los procedimientos',

    // Team
    'Advisory Board': 'Consejo Asesor',
    'CEO & Co-Founder': 'CEO y Cofundador',
    'Co-Founder': 'Cofundador',
    'Co-Founder and Head of Clinical Affairs': 'Cofundador y Director de Asuntos Clínicos',
    Advisor: 'Asesor',
    'USC Biomedical Engineering': 'Ingeniería Biomédica, USC',
    'USC Biomedical Engineering and Mechanical Engineering': 'Ingeniería Biomédica y Mecánica, USC',
    'USC Biomedical Engineering and Pre-Medicine': 'Ingeniería Biomédica y Premedicina, USC',
    'Cornell University Biomedical Engineering': 'Ingeniería Biomédica, Universidad de Cornell',
    'PhD Mechanical Engineering': 'Doctorado en Ingeniería Mecánica',
    'MD, PhD, FACS, Otolaryngology (ENT) Surgeon': 'MD, PhD, FACS, Cirujano Otorrinolaringólogo (ORL)',
    'Our Team': 'Nuestro Equipo',

    // TeamHighlight quote
    "We are a group of passionate undergrads who are hungry to make a change in the surgical space. We're giving it our all to make this happen. We'd like to think we are carbon atoms undergoing pressure to become diamonds.":
      'Somos un grupo de estudiantes universitarios apasionados, con muchas ganas de generar un cambio en el mundo quirúrgico. Le estamos dando todo para lograrlo. Nos gusta pensar que somos átomos de carbono sometidos a presión para convertirnos en diamantes.',

    // News
    'News.': 'Noticias.',
    '2nd Place, USC Viterbi Min Family Challenge': '2.º lugar, Min Family Challenge de USC Viterbi',
    "The Min Family Challenge (MFC) is USC Viterbi's flagship student venture competition, part of tiehub's annual $150K Awards Night, awarding funding to student-founded startups with the strongest potential for real-world impact. At the 2026 MEPC & MFC Awards Night on April 27, our team placed 2nd overall and was also selected by audience vote as one of three finalists to deliver a live three-minute pitch, which we won, bringing a working prototype of the LapRotator to the stage.":
      'El Min Family Challenge (MFC) es la competencia insignia de emprendimiento estudiantil de USC Viterbi, parte de la Noche de Premios anual de $150,000 de tiehub, que otorga financiamiento a startups fundadas por estudiantes con el mayor potencial de impacto real. En la Noche de Premios MEPC y MFC 2026, celebrada el 27 de abril, nuestro equipo obtuvo el 2.º lugar general y también fue elegido por votación del público como uno de tres finalistas para dar un discurso en vivo de tres minutos, el cual ganamos, llevando al escenario un prototipo funcional del LapRotator.',
    'Closed $60K Pre-Seed Round': 'Cerramos una Ronda Semilla de $60,000',
    "We closed a $60,000 pre-seed round to fund our utility patent filing and kick off the FDA regulatory process, including the testing needed to support that submission. Thank you to everyone who believed in what we're building this early on.":
      'Cerramos una ronda semilla de $60,000 para financiar la presentación de nuestra patente de utilidad y dar inicio al proceso regulatorio ante la FDA, incluyendo las pruebas necesarias para respaldar esa solicitud. Gracias a todos los que creyeron en lo que estamos construyendo desde esta etapa tan temprana.',
    'Filing Our Utility Patent': 'Presentando Nuestra Patente de Utilidad',
    'We\'re working with patent counsel to file a utility patent protecting the core LapRotator mechanism, covering the one-handed rotation drive and control interface. The application is in preparation now, and we expect to submit it soon.':
      'Estamos trabajando con asesores de patentes para presentar una patente de utilidad que proteja el mecanismo central del LapRotator, incluyendo el sistema de rotación con una sola mano y la interfaz de control. La solicitud está en preparación y esperamos presentarla pronto.',
    "The Pando Surgical team celebrating at USC Viterbi's MEPC & MFC Awards Night": 'El equipo de Pando Surgical celebrando en la Noche de Premios MEPC y MFC de USC Viterbi',
    'The Charging Bull statue near Wall Street': 'La estatua del Toro de Wall Street',
    'Close-up of the LapRotator control handle': 'Primer plano del mango de control del LapRotator',
    'Photo: The Wall Street Experience': 'Foto: The Wall Street Experience',
    'Previous news item': 'Noticia anterior',
    'Next news item': 'Siguiente noticia',

    // Contact form
    'Full Name': 'Nombre Completo',
    'Email Address': 'Correo Electrónico',
    'Phone Number': 'Número de Teléfono',
    'Company/Organization': 'Empresa/Organización',
    'Inquiry Type': 'Tipo de Consulta',
    Message: 'Mensaje',
    'Select an option': 'Selecciona una opción',
    'Product Information': 'Información del Producto',
    'Request a Demo': 'Solicitar una Demostración',
    'Partnership Opportunity': 'Oportunidad de Colaboración',
    'Technical Support': 'Soporte Técnico',
    Other: 'Otro',
    'Thank You for Your Inquiry!': '¡Gracias por tu Consulta!',
    'Your message has been successfully submitted.': 'Tu mensaje se envió con éxito.',
    'A confirmation email has been sent to your inbox.': 'Se envió un correo de confirmación a tu bandeja de entrada.',
    'Please check your': 'Revisa tu',
    'spam or junk folder': 'carpeta de spam o correo no deseado',
    "if you don't see it within a few minutes.": 'si no lo recibes en unos minutos.',
    "We'll get back to you as soon as possible!": '¡Te responderemos lo antes posible!',
    'Submit Another Inquiry': 'Enviar Otra Consulta',
    'Sending...': 'Enviando...',
    'Submit Inquiry': 'Enviar Consulta',
    'Failed to send:': 'Error al enviar:',
    'Please try again or contact us directly.': 'Inténtalo de nuevo o contáctanos directamente.',
    'Unknown error': 'Error desconocido',

    // Internship application form
    'Resume (Google Drive Link)': 'Currículum (Enlace de Google Drive)',
    'Make sure sharing is set to "Anyone with the link can view" so we can open it.':
      'Asegúrate de que el acceso esté configurado como "Cualquier persona con el enlace puede ver" para que podamos abrirlo.',
    'Tell us about yourself': 'Cuéntanos sobre ti',
    'Why Pando Surgical? Why this role?': '¿Por qué Pando Surgical? ¿Por qué este puesto?',
    'What skillsets can you bring to this role?': '¿Qué habilidades puedes aportar a este puesto?',
    'Application Received': 'Solicitud Recibida',
    "Thanks for applying. We'll review your application and be in contact with you soon.":
      'Gracias por postularte. Revisaremos tu solicitud y nos pondremos en contacto contigo pronto.',
    'Submit Another Application': 'Enviar Otra Solicitud',
    'Submitting...': 'Enviando...',
    'Submit Application': 'Enviar Solicitud',
    'Please try again or email us directly.': 'Inténtalo de nuevo o escríbenos directamente por correo.',

    // Firebase-originated error strings (shown in forms)
    'Database is not configured': 'La base de datos no está configurada',
    'Could not save your inquiry (server permissions). Please contact us by email.':
      'No se pudo guardar tu consulta (permisos del servidor). Contáctanos por correo electrónico.',
    'Failed to save your inquiry': 'No se pudo guardar tu consulta',
    'Could not save your application (server permissions). Please contact us by email.':
      'No se pudo guardar tu solicitud (permisos del servidor). Contáctanos por correo electrónico.',
    'Failed to save your application': 'No se pudo guardar tu solicitud',

    // Footer
    Connect: 'Conecta',
    'Privacy Notice': 'Aviso de Privacidad',
    'Terms of Use': 'Términos de Uso',
    'Accessibility Statement': 'Declaración de Accesibilidad',
    '© 2026 Pando Surgical, Inc. All rights reserved.': '© 2026 Pando Surgical, Inc. Todos los derechos reservados.',
    'Follow Pando Surgical on LinkedIn': 'Sigue a Pando Surgical en LinkedIn',
    'Watch Pando Surgical on YouTube': 'Mira a Pando Surgical en YouTube',
    'Los Angeles, CA': 'Los Ángeles, CA',
    'Salt Lake City, UT': 'Salt Lake City, UT',
    'Houston, TX': 'Houston, TX',
    'Iowa City, Iowa': 'Iowa City, Iowa',
    'Tokyo, Japan': 'Tokio, Japón',

    // Legal pages
    'Last updated: August 2026': 'Última actualización: agosto de 2026',
    'Information we collect': 'Información que recopilamos',
    'When you use our contact form, we collect the name, email address, and message you provide so we can respond to your inquiry. We do not require an account or collect payment information on this site. We use aggregated, anonymous performance data (such as page load metrics) to help us keep the site running smoothly.':
      'Cuando usas nuestro formulario de contacto, recopilamos el nombre, correo electrónico y mensaje que proporcionas para poder responder a tu consulta. No requerimos una cuenta ni recopilamos información de pago en este sitio. Usamos datos de rendimiento agregados y anónimos (como métricas de tiempo de carga) para ayudarnos a mantener el sitio funcionando sin problemas.',
    'How we use it': 'Cómo la utilizamos',
    'Information submitted through our contact form is used only to respond to your message and is not sold or shared with third parties for marketing purposes.':
      'La información enviada a través de nuestro formulario de contacto se utiliza únicamente para responder a tu mensaje y no se vende ni se comparte con terceros con fines de marketing.',
    Cookies: 'Cookies',
    'This site does not use advertising or tracking cookies. Basic, privacy-preserving analytics may be used to understand overall site usage.':
      'Este sitio no utiliza cookies publicitarias ni de seguimiento. Podemos usar análisis básicos que respetan la privacidad para comprender el uso general del sitio.',
    'Questions about this notice can be sent to': 'Las preguntas sobre este aviso pueden enviarse a',
    'Purpose of this site': 'Propósito de este sitio',
    'This website is provided by Pando Surgical, Inc. for general informational purposes about our company and the devices we are developing, including the LapRotator. Content on this site does not constitute medical advice, and devices described may not yet be commercially available or cleared for sale in all regions.':
      'Este sitio web es proporcionado por Pando Surgical, Inc. con fines informativos generales sobre nuestra empresa y los dispositivos que estamos desarrollando, incluido el LapRotator. El contenido de este sitio no constituye asesoramiento médico, y los dispositivos descritos podrían no estar aún disponibles comercialmente ni autorizados para su venta en todas las regiones.',
    'Intellectual property': 'Propiedad intelectual',
    'The Pando Surgical name, logo, and site content are the property of Pando Surgical, Inc. and may not be reproduced without permission.':
      'El nombre, el logotipo y el contenido del sitio de Pando Surgical son propiedad de Pando Surgical, Inc. y no pueden reproducirse sin autorización.',
    'No warranty': 'Sin garantía',
    'This site is provided "as is" without warranties of any kind. We make reasonable efforts to keep information accurate and up to date but do not guarantee completeness or accuracy at all times.':
      'Este sitio se proporciona "tal cual", sin garantías de ningún tipo. Hacemos esfuerzos razonables para mantener la información precisa y actualizada, pero no garantizamos su exactitud o integridad en todo momento.',
    'Questions about these terms can be sent to': 'Las preguntas sobre estos términos pueden enviarse a',
    'Our commitment': 'Nuestro compromiso',
    'Pando Surgical is committed to making our website usable by as many people as possible, including people with disabilities. We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA as a general standard for our site.':
      'Pando Surgical se compromete a que nuestro sitio web pueda ser utilizado por la mayor cantidad de personas posible, incluidas las personas con discapacidad. Buscamos seguir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA, como estándar general para nuestro sitio.',
    'Ongoing work': 'Trabajo continuo',
    'As a small, growing team, we are continuously improving the accessibility of this site, including color contrast, keyboard navigation, and screen reader support, as we add new pages and features.':
      'Como equipo pequeño y en crecimiento, mejoramos continuamente la accesibilidad de este sitio, incluyendo el contraste de color, la navegación por teclado y la compatibilidad con lectores de pantalla, a medida que agregamos nuevas páginas y funciones.',
    Feedback: 'Comentarios',
    'If you encounter any accessibility barriers on this site, please let us know at': 'Si encuentras alguna barrera de accesibilidad en este sitio, avísanos a',
    'so we can address them.': 'para que podamos solucionarla.',

    // Careers page
    "We're opening up an internship spot for an Engineering intern.": 'Estamos abriendo una vacante de pasantía para un Ingeniero en formación.',
    "We're looking for an Engineering intern to join our team. Submit your resume and a few short answers below, and we'll be in contact with you after reviewing your application. You can also reach us directly at":
      'Buscamos un pasante de Ingeniería para unirse a nuestro equipo. Envía tu currículum y algunas respuestas breves a continuación, y nos pondremos en contacto contigo después de revisar tu solicitud. También puedes escribirnos directamente a',

    // Company page
    'How Pando Surgical Started': 'Cómo Comenzó Pando Surgical',
    'Pando Surgical started with the mission to improve surgical ergonomics. We are a group of engineers who work closely with physicians, and we noticed that many surgical tools create unnecessary strain on surgeons because they are designed with only one anatomy in mind. As the workforce diversifies, we aim to equip every surgeon with tools that support them.':
      'Pando Surgical nació con la misión de mejorar la ergonomía quirúrgica. Somos un grupo de ingenieros que trabajamos de cerca con médicos, y notamos que muchas herramientas quirúrgicas generan una tensión innecesaria en los cirujanos porque están diseñadas pensando en un solo tipo de anatomía. A medida que la fuerza laboral se diversifica, buscamos equipar a cada cirujano con herramientas que lo respalden.',
    'What We Value': 'Lo Que Valoramos',
    Equitable: 'Equitativo',
    'Every surgeon deserves to feel supported. This starts with the tools they use.':
      'Todo cirujano merece sentirse respaldado, y eso comienza con las herramientas que utiliza.',
    Efficient: 'Eficiente',
    'We design to improve surgical workflows, reducing operating time and improving patient outcomes.':
      'Diseñamos para mejorar los flujos de trabajo quirúrgicos, reduciendo el tiempo de operación y mejorando los resultados para los pacientes.',
    'We are creating a world where the intersection between humans and technology is seamless.':
      'Estamos creando un mundo donde la intersección entre las personas y la tecnología sea completamente fluida.',
    'Get to know the people behind Pando Surgical': 'Conoce a las Personas Detrás de Pando Surgical',
    'Meet the Team': 'Conoce al Equipo',
    'Get in Touch': 'Ponte en Contacto',

    // Investors page
    'Investors & Resources': 'Inversionistas y Recursos',
    'Investor materials are coming soon.': 'Los materiales para inversionistas estarán disponibles próximamente.',
    "We'll be opening up our seed round soon. Check back here for updates, or reach out directly if you'd like to learn more.":
      'Pronto abriremos nuestra ronda semilla. Vuelve a consultar esta página para novedades, o contáctanos directamente si quieres saber más.',
    'Pitch Deck': 'Presentación para Inversionistas',
    'Financial Overview': 'Resumen Financiero',
    'Press Kit': 'Kit de Prensa',
    'Coming soon': 'Próximamente',
    'Interested in learning more?': '¿Interesado en saber más?',

    // ENT product page
    'Ergonomic ENT Product': 'Producto ORL Ergonómico',
    "We're developing a new ergonomic solution for ENT procedures. The product is currently in stealth, so details are under wraps for now. Check back soon.":
      'Estamos desarrollando una nueva solución ergonómica para procedimientos otorrinolaringológicos. El producto se encuentra actualmente en modo confidencial, por lo que los detalles no están disponibles por ahora. Vuelve pronto.',
    'Interested? Get in touch.': '¿Interesado? Ponte en Contacto.',

    // Product page
    'One-Handed Laparoscope Rotation: an attachment for laparoscopes that gives surgeons intuitive, single-handed control.':
      'Rotación Laparoscópica con Una Sola Mano: un accesorio para laparoscopios que le da al cirujano un control intuitivo y con una sola mano.',
    'Interested in bringing LapRotator to your OR?': '¿Interesado en llevar el LapRotator a tu quirófano?',
  },
  zh: {
    // Nav / header / global UI
    Product: '产品',
    LapRotator: 'LapRotator',
    'ENT Product': '耳鼻喉产品',
    Team: '团队',
    News: '新闻',
    About: '关于我们',
    Company: '公司',
    Investors: '投资者',
    Careers: '招聘',
    'Contact Us': '联系我们',
    'Contact Us.': '联系我们。',
    'Log in': '登录',
    Dashboard: '控制台',
    'Search...': '搜索...',
    Language: '语言',
    Home: '首页',
    Contact: '联系我们',
    'No results found.': '未找到相关结果。',
    Search: '搜索',
    'Close search': '关闭搜索',
    'Change language': '切换语言',
    'Main navigation': '主导航',
    'Mobile navigation': '移动端导航',
    'Open dashboard': '打开控制台',
    'Open login': '打开登录',
    'Close navigation menu': '关闭导航菜单',
    'Open navigation menu': '打开导航菜单',

    // Homepage hero carousel
    'One-handed laparoscope rotation': '单手腹腔镜旋转',
    'Learn more': '了解更多',
    '2nd Place, USC Viterbi MFC': '南加州大学Viterbi MFC 亚军',
    'We won the live pitch round with the LapRotator.': '我们凭借LapRotator赢得了现场路演环节。',
    'Read more': '阅读更多',
    'Pando Surgical highlights': 'Pando Surgical 精选',
    'The LapRotator device': 'LapRotator设备',
    'Previous slide': '上一张',
    'Next slide': '下一张',

    // VideoOverlay + Footer tagline
    'We are Pando Surgical': '我们是 Pando Surgical',
    'Est. 2025 | Making surgical tools equitable, efficient, and ergonomic.':
      '成立于2025年 | 致力于打造更公平、高效、符合人体工学的手术工具。',

    // Mission
    'Our Mission': '我们的使命',
    'To make surgery more': '让手术更加',
    equitable: '公平',
    efficient: '高效',
    and: '和',
    ergonomic: '符合人体工学',
    'by developing tools that empower surgeons worldwide.': '通过开发赋能全球外科医生的工具。',
    'One-Handed': '单手操作',
    'Laparoscope Rotation': '腹腔镜旋转',
    Universal: '通用兼容',
    'System Compatibility': '系统兼容性',
    Ergonomic: '符合人体工学',
    'Less Surgeon Fatigue': '减少外科医生疲劳',
    'Quick Setup': '快速安装',
    'Easy Attachment': '轻松装配',

    // Product page hero + tabs
    'One-Handed Laparoscope Rotation': '单手腹腔镜旋转',
    'The LapRotator is an attachment on the laparoscope that gives surgeons full one-handed control over scope rotation during minimally invasive procedures.':
      'LapRotator是一款安装在腹腔镜上的配件，让外科医生在微创手术中能够单手完全控制镜头的旋转。',
    'By removing the need for a second hand or assistant to reposition the scope, it helps surgeons reduce fatigue during long procedures, mitigate safety hazards, and work more efficiently in the OR.':
      '无需第二只手或助手来调整镜头位置，帮助外科医生在长时间手术中减少疲劳、降低安全隐患，并提高手术室工作效率。',
    'See the Difference': '查看差异',
    'Features and Advantages': '功能与优势',
    Specifications: '规格参数',
    'Detailed specifications are coming soon.': '详细规格参数即将上线。',
    'LapRotator - See the Difference': 'LapRotator：查看差异',
    'LapRotator V2 laparoscope rotation device render': 'LapRotator V2腹腔镜旋转设备渲染图',
    'The LapRotator device mounted on a laparoscope': '安装在腹腔镜上的LapRotator设备',
    'View product image': '查看产品图片',
    'Previous product image': '上一张产品图片',
    'Next product image': '下一张产品图片',

    // Comparison
    'Without LapRotator': '未使用LapRotator',
    'With LapRotator V2': '使用LapRotator V2',
    'Traditional laparoscopic surgery technique without LapRotator': '未使用LapRotator的传统腹腔镜手术技术',
    'Laparoscopic surgery with LapRotator V2': '使用LapRotator V2的腹腔镜手术',

    // FeaturesAndAdvantages
    'Compatible with existing laparoscopic systems': '兼容现有腹腔镜系统',
    'One-handed rotation for enhanced control': '单手旋转，提升操控精度',
    'Compact and lightweight frame': '结构紧凑、重量轻',
    'Simple user interface': '操作界面简单直观',
    'Designed to help reduce surgeon fatigue during procedures': '有助于减轻外科医生在手术过程中的疲劳',

    // Team
    'Advisory Board': '顾问委员会',
    'CEO & Co-Founder': '首席执行官兼联合创始人',
    'Co-Founder': '联合创始人',
    'Co-Founder and Head of Clinical Affairs': '联合创始人兼临床事务负责人',
    Advisor: '顾问',
    'USC Biomedical Engineering': '南加州大学生物医学工程专业',
    'USC Biomedical Engineering and Mechanical Engineering': '南加州大学生物医学工程与机械工程专业',
    'USC Biomedical Engineering and Pre-Medicine': '南加州大学生物医学工程与医学预科专业',
    'Cornell University Biomedical Engineering': '康奈尔大学生物医学工程专业',
    'PhD Mechanical Engineering': '机械工程博士',
    'MD, PhD, FACS, Otolaryngology (ENT) Surgeon': '医学博士、哲学博士、美国外科医师学院院士，耳鼻喉科医生',
    'Our Team': '我们的团队',

    // TeamHighlight quote
    "We are a group of passionate undergrads who are hungry to make a change in the surgical space. We're giving it our all to make this happen. We'd like to think we are carbon atoms undergoing pressure to become diamonds.":
      '我们是一群充满热情的本科生，渴望在外科手术领域带来改变。我们正竭尽全力实现这个目标。我们愿意把自己看作承受压力、最终蜕变成钻石的碳原子。',

    // News
    'News.': '新闻。',
    '2nd Place, USC Viterbi Min Family Challenge': '南加州大学Viterbi Min Family Challenge 亚军',
    "The Min Family Challenge (MFC) is USC Viterbi's flagship student venture competition, part of tiehub's annual $150K Awards Night, awarding funding to student-founded startups with the strongest potential for real-world impact. At the 2026 MEPC & MFC Awards Night on April 27, our team placed 2nd overall and was also selected by audience vote as one of three finalists to deliver a live three-minute pitch, which we won, bringing a working prototype of the LapRotator to the stage.":
      'Min Family Challenge（MFC）是南加州大学Viterbi工程学院的旗舰学生创业大赛，是tiehub一年一度、总奖金15万美元颁奖之夜的重要组成部分，旨在为最具现实影响力潜力的学生创业公司提供资金支持。在2026年4月27日举行的MEPC与MFC颁奖之夜上，我们的团队总成绩获得亚军，并凭借观众投票入选三强，登台进行三分钟现场路演，最终我们带着LapRotator的实机原型赢得了这一轮比赛。',
    'Closed $60K Pre-Seed Round': '完成6万美元种子前轮融资',
    "We closed a $60,000 pre-seed round to fund our utility patent filing and kick off the FDA regulatory process, including the testing needed to support that submission. Thank you to everyone who believed in what we're building this early on.":
      '我们完成了一轮6万美元的种子前融资，用于资助实用专利的申请，并启动FDA监管审批流程，包括支持该申请所需的各项测试。感谢每一位在如此早期阶段就相信我们正在做的事情的人。',
    'Filing Our Utility Patent': '正在申请实用新型专利',
    'We\'re working with patent counsel to file a utility patent protecting the core LapRotator mechanism, covering the one-handed rotation drive and control interface. The application is in preparation now, and we expect to submit it soon.':
      '我们正与专利律师合作，为LapRotator的核心机构申请实用新型专利，涵盖单手旋转驱动装置及控制界面。申请文件目前正在准备中，我们预计将很快提交。',
    "The Pando Surgical team celebrating at USC Viterbi's MEPC & MFC Awards Night": 'Pando Surgical团队在南加州大学Viterbi MEPC与MFC颁奖之夜上庆祝',
    'The Charging Bull statue near Wall Street': '华尔街附近的冲牛铜像',
    'Close-up of the LapRotator control handle': 'LapRotator控制手柄特写',
    'Photo: The Wall Street Experience': '照片来源：The Wall Street Experience',
    'Previous news item': '上一条新闻',
    'Next news item': '下一条新闻',

    // Contact form
    'Full Name': '姓名',
    'Email Address': '电子邮箱',
    'Phone Number': '电话号码',
    'Company/Organization': '公司/机构',
    'Inquiry Type': '咨询类型',
    Message: '留言内容',
    'Select an option': '请选择',
    'Product Information': '产品信息',
    'Request a Demo': '申请演示',
    'Partnership Opportunity': '合作机会',
    'Technical Support': '技术支持',
    Other: '其他',
    'Thank You for Your Inquiry!': '感谢您的咨询！',
    'Your message has been successfully submitted.': '您的留言已成功提交。',
    'A confirmation email has been sent to your inbox.': '确认邮件已发送至您的邮箱。',
    'Please check your': '请检查您的',
    'spam or junk folder': '垃圾邮件文件夹',
    "if you don't see it within a few minutes.": '如果几分钟内没有收到的话。',
    "We'll get back to you as soon as possible!": '我们会尽快回复您！',
    'Submit Another Inquiry': '提交新的咨询',
    'Sending...': '发送中...',
    'Submit Inquiry': '提交咨询',
    'Failed to send:': '发送失败：',
    'Please try again or contact us directly.': '请重试，或直接联系我们。',
    'Unknown error': '未知错误',

    // Internship application form
    'Resume (Google Drive Link)': '简历（谷歌云端硬盘链接）',
    'Make sure sharing is set to "Anyone with the link can view" so we can open it.':
      '请确保共享权限设置为「知道链接的任何人可查看」，以便我们能够打开。',
    'Tell us about yourself': '请介绍一下你自己',
    'Why Pando Surgical? Why this role?': '您为什么想加入Pando Surgical？为什么选择这个职位？',
    'What skillsets can you bring to this role?': '您能为这个职位带来哪些技能？',
    'Application Received': '申请已收到',
    "Thanks for applying. We'll review your application and be in contact with you soon.":
      '感谢您的申请。我们将审核您的申请材料，并尽快与您联系。',
    'Submit Another Application': '提交新的申请',
    'Submitting...': '提交中...',
    'Submit Application': '提交申请',
    'Please try again or email us directly.': '请重试，或直接给我们发邮件。',

    // Firebase-originated error strings (shown in forms)
    'Database is not configured': '数据库未配置',
    'Could not save your inquiry (server permissions). Please contact us by email.':
      '无法保存您的咨询信息（服务器权限问题）。请通过邮件联系我们。',
    'Failed to save your inquiry': '保存咨询信息失败',
    'Could not save your application (server permissions). Please contact us by email.':
      '无法保存您的申请信息（服务器权限问题）。请通过邮件联系我们。',
    'Failed to save your application': '保存申请信息失败',

    // Footer
    Connect: '联系方式',
    'Privacy Notice': '隐私声明',
    'Terms of Use': '使用条款',
    'Accessibility Statement': '无障碍声明',
    '© 2026 Pando Surgical, Inc. All rights reserved.': '© 2026 Pando Surgical, Inc. 保留所有权利。',
    'Follow Pando Surgical on LinkedIn': '在领英关注Pando Surgical',
    'Watch Pando Surgical on YouTube': '在YouTube观看Pando Surgical',
    'Los Angeles, CA': '美国洛杉矶',
    'Salt Lake City, UT': '美国盐湖城',
    'Houston, TX': '美国休斯顿',
    'Iowa City, Iowa': '美国爱荷华市',
    'Tokyo, Japan': '日本东京',

    // Legal pages
    'Last updated: August 2026': '最后更新：2026年8月',
    'Information we collect': '我们收集的信息',
    'When you use our contact form, we collect the name, email address, and message you provide so we can respond to your inquiry. We do not require an account or collect payment information on this site. We use aggregated, anonymous performance data (such as page load metrics) to help us keep the site running smoothly.':
      '当您使用我们的联系表单时，我们会收集您提供的姓名、电子邮箱和留言内容，以便回复您的咨询。本网站不要求注册账户，也不收集任何付款信息。我们会使用汇总的匿名性能数据（例如页面加载指标）来帮助保持网站的正常运行。',
    'How we use it': '我们如何使用这些信息',
    'Information submitted through our contact form is used only to respond to your message and is not sold or shared with third parties for marketing purposes.':
      '通过联系表单提交的信息仅用于回复您的留言，不会出售或与第三方共享用于营销目的。',
    Cookies: 'Cookie',
    'This site does not use advertising or tracking cookies. Basic, privacy-preserving analytics may be used to understand overall site usage.':
      '本网站不使用广告或追踪类Cookie。我们可能会使用保护隐私的基础分析工具，以了解网站的整体使用情况。',
    'Questions about this notice can be sent to': '如对本声明有任何疑问，请发送邮件至',
    'Purpose of this site': '本网站的用途',
    'This website is provided by Pando Surgical, Inc. for general informational purposes about our company and the devices we are developing, including the LapRotator. Content on this site does not constitute medical advice, and devices described may not yet be commercially available or cleared for sale in all regions.':
      '本网站由Pando Surgical, Inc.提供，旨在介绍我们公司及正在研发的设备（包括LapRotator）的一般性信息。本网站内容不构成医疗建议，所描述的设备可能尚未在所有地区获得商业上市或销售许可。',
    'Intellectual property': '知识产权',
    'The Pando Surgical name, logo, and site content are the property of Pando Surgical, Inc. and may not be reproduced without permission.':
      'Pando Surgical的名称、标识及网站内容均为Pando Surgical, Inc.所有，未经许可不得转载或复制。',
    'No warranty': '免责声明',
    'This site is provided "as is" without warranties of any kind. We make reasonable efforts to keep information accurate and up to date but do not guarantee completeness or accuracy at all times.':
      '本网站按"现状"提供，不附带任何形式的保证。我们会尽合理努力保持信息的准确性与时效性，但不保证内容在任何时候都完整或准确。',
    'Questions about these terms can be sent to': '如对本条款有任何疑问，请发送邮件至',
    'Our commitment': '我们的承诺',
    'Pando Surgical is committed to making our website usable by as many people as possible, including people with disabilities. We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA as a general standard for our site.':
      'Pando Surgical致力于让尽可能多的人（包括残障人士）都能顺畅使用我们的网站。我们力求遵循《网页内容无障碍指南》（WCAG）2.1 AA级标准，作为本网站的总体规范。',
    'Ongoing work': '持续改进',
    'As a small, growing team, we are continuously improving the accessibility of this site, including color contrast, keyboard navigation, and screen reader support, as we add new pages and features.':
      '作为一个不断成长的小团队，我们正在持续改进本网站的无障碍体验，包括色彩对比度、键盘导航和屏幕阅读器支持等方面，并会随着新页面和新功能的加入不断完善。',
    Feedback: '意见反馈',
    'If you encounter any accessibility barriers on this site, please let us know at': '如果您在使用本网站时遇到任何无障碍访问方面的问题，请通过',
    'so we can address them.': '告知我们，以便我们及时处理。',

    // Careers page
    "We're opening up an internship spot for an Engineering intern.": '我们正在开放一个工程实习生的实习岗位。',
    "We're looking for an Engineering intern to join our team. Submit your resume and a few short answers below, and we'll be in contact with you after reviewing your application. You can also reach us directly at":
      '我们正在招聘一名工程实习生加入我们的团队。请在下方提交您的简历并回答几个简短问题，我们会在审核您的申请后与您联系。您也可以直接通过以下邮箱联系我们：',

    // Company page
    'How Pando Surgical Started': 'Pando Surgical的创立故事',
    'Pando Surgical started with the mission to improve surgical ergonomics. We are a group of engineers who work closely with physicians, and we noticed that many surgical tools create unnecessary strain on surgeons because they are designed with only one anatomy in mind. As the workforce diversifies, we aim to equip every surgeon with tools that support them.':
      'Pando Surgical的使命是改善手术的人体工学设计。我们是一群与医生密切合作的工程师，我们注意到许多手术器械只针对单一体型设计，给外科医生带来了不必要的负担。随着从业人员日趋多元化，我们希望为每一位外科医生配备真正支持他们的工具。',
    'What We Value': '我们的价值观',
    Equitable: '公平',
    'Every surgeon deserves to feel supported. This starts with the tools they use.':
      '每一位外科医生都应该获得支持，而这要从他们所使用的工具开始。',
    Efficient: '高效',
    'We design to improve surgical workflows, reducing operating time and improving patient outcomes.':
      '我们的设计致力于优化手术流程，缩短手术时间，改善患者预后。',
    'We are creating a world where the intersection between humans and technology is seamless.':
      '我们致力于打造一个人类与科技无缝衔接的世界。',
    'Get to know the people behind Pando Surgical': '认识Pando Surgical背后的团队',
    'Meet the Team': '认识团队',
    'Get in Touch': '联系我们',

    // Investors page
    'Investors & Resources': '投资者与资源',
    'Investor materials are coming soon.': '投资者相关资料即将上线。',
    "We'll be opening up our seed round soon. Check back here for updates, or reach out directly if you'd like to learn more.":
      '我们即将开放种子轮融资。请留意本页面的更新，或直接联系我们以了解更多信息。',
    'Pitch Deck': '路演材料',
    'Financial Overview': '财务概览',
    'Press Kit': '媒体资料包',
    'Coming soon': '即将推出',
    'Interested in learning more?': '想了解更多吗？',

    // ENT product page
    'Ergonomic ENT Product': '人体工学耳鼻喉产品',
    "We're developing a new ergonomic solution for ENT procedures. The product is currently in stealth, so details are under wraps for now. Check back soon.":
      '我们正在为耳鼻喉手术研发一款全新的人体工学解决方案。该产品目前处于保密研发阶段，具体细节暂不公开，敬请期待。',
    'Interested? Get in touch.': '感兴趣？欢迎联系我们。',

    // Product page
    'One-Handed Laparoscope Rotation: an attachment for laparoscopes that gives surgeons intuitive, single-handed control.':
      '单手腹腔镜旋转：一款为腹腔镜设计的配件，让外科医生实现直观的单手操控。',
    'Interested in bringing LapRotator to your OR?': '有意将LapRotator引入您的手术室吗？',
  },
};

export function translate(lang: Language, key: string): string {
  return translations[lang]?.[key] ?? key;
}

/** Natural per-language sentence builders for the handful of strings with an embedded proper name,
 * where simple key/value lookup would force an unnatural word order in Spanish/Chinese. */
export function translateLinkedInAria(lang: Language, name: string): string {
  switch (lang) {
    case 'es':
      return `Ver el perfil de LinkedIn de ${name}`;
    case 'zh':
      return `查看${name}的领英主页`;
    default:
      return `View ${name}'s LinkedIn profile`;
  }
}

export function translateTeamPhotoAlt(lang: Language, name: string, translatedRole: string): string {
  switch (lang) {
    case 'es':
      return `${name}, ${translatedRole} en Pando Surgical`;
    case 'zh':
      return `Pando Surgical的${name}，${translatedRole}`;
    default:
      return `${name}, ${translatedRole} at Pando Surgical`;
  }
}

export function translateExpandAria(lang: Language, expanded: boolean, translatedLabel: string): string {
  if (expanded) {
    switch (lang) {
      case 'es':
        return `Contraer ${translatedLabel}`;
      case 'zh':
        return `收起${translatedLabel}`;
      default:
        return `Collapse ${translatedLabel}`;
    }
  }
  switch (lang) {
    case 'es':
      return `Ampliar ${translatedLabel}`;
    case 'zh':
      return `展开${translatedLabel}`;
    default:
      return `Expand ${translatedLabel}`;
  }
}

export function translateWordCount(lang: Language, count: number, limit: number): string {
  switch (lang) {
    case 'es':
      return `${count}/${limit} palabras`;
    case 'zh':
      return `${count}/${limit} 词`;
    default:
      return `${count}/${limit} words`;
  }
}

const STORAGE_KEY = 'pando-language';

export function getStoredLanguage(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'es' || stored === 'zh' ? stored : 'en';
}

export function storeLanguage(lang: Language) {
  window.localStorage.setItem(STORAGE_KEY, lang);
}
