import { AfterViewInit, Component, ElementRef, HostListener, signal } from '@angular/core';

type Stat = { value: number; suffix: string; current: number; animated: boolean };
type Content = {
  nav: string[]; contact: string; switch: string; hero: string; idea: string; viewProjects: string;
  work: string; servicesHeading: string; processHeading: string; quote: string; quoteBy: string;
  plansHeading: string; planButton: string; faqHeading: string; contactHeading: string; city: string;
  previousProject: string; nextProject: string; viewProject: string; planLabel: string;
  formName: string; formEmail: string; formBusiness: string; formMessage: string; formSend: string; formPlan: string; formSending: string; formSuccess: string; formError: string;
  projects: { title: string; category: string; image: string }[];
  services: { title: string; text: string }[];
  process: [string, string][]; plans: [string, string][]; faqs: [string, string][]; stats: string[];
};

@Component({ selector: 'app-root', imports: [], templateUrl: './app.html', styleUrl: './app.css' })
export class App implements AfterViewInit {
  protected readonly language = signal<'es' | 'en'>('es');
  protected readonly isScrolled = signal(false);
  protected readonly navVisible = signal(false);
  protected readonly curtainOpen = signal(false);
  protected readonly activeService = signal(0);
  protected readonly selectedPlan = signal('');
  protected readonly emailStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  protected readonly copy: Record<'es' | 'en', Content> = {
    es: {
      nav: ['Trabajo', 'Servicios', 'Proceso', 'Planes'], contact: 'Contacto', switch: 'EN',
      hero: 'Sitios web con direcci\u00f3n visual, mensaje claro y enfoque en resultados para negocios de Panam\u00e1.', idea: 'Deja tu idea', viewProjects: 'Ver proyectos',
      work: 'Trabajo que se siente serio desde el primer vistazo.', servicesHeading: 'Servicios para que tu negocio venda con m\u00e1s confianza.', processHeading: 'Un proceso directo, cercano y sin perder tiempo.',
      quote: '"No construyo p\u00e1ginas para decorar internet. Construyo una presencia que haga que tu cliente conf\u00ede antes de escribirte."', quoteBy: 'Kevin Mena, desarrollador web personal',
      plansHeading: 'Planes seg\u00fan lo que necesitas mover.', planButton: 'Conversar proyecto', faqHeading: 'Preguntas frecuentes.', contactHeading: 'Tu negocio necesita una web que entre en escena.', city: 'Panam\u00e1',
      previousProject: 'Proyecto anterior', nextProject: 'Proyecto siguiente', viewProject: 'Ver imagen ampliada de', planLabel: 'Consultar plan',
      formName: 'Tu nombre', formEmail: 'Tu correo', formBusiness: 'Nombre de tu negocio', formMessage: 'Cuéntame qué necesitas', formSend: 'Enviar consulta', formPlan: 'Plan de interés', formSending: 'Enviando...', formSuccess: 'Tu consulta fue enviada. Kevin te responderá pronto.', formError: 'No se pudo enviar la consulta. Inténtalo de nuevo.',
      projects: [
        { title: 'An\u00edbal Rey de Corazones', category: 'Marca personal con presencia comercial', image: 'assets/images/anibal.png' },
        { title: 'Jornada Industrial', category: 'Sitio para atraer empresas', image: 'assets/images/jornada-industrial.png' },
        { title: 'La Casa del Jean', category: 'Escaparate digital para venta local', image: 'assets/images/casa-jean.png' },
      ],
      services: [
        { title: 'Dise\u00f1o web', text: 'Una p\u00e1gina con presencia fuerte, mensaje claro y una ruta pensada para que el visitante te contacte.' },
        { title: 'Desarrollo a medida', text: 'Construyo la experiencia que tu negocio necesita, sin plantillas gen\u00e9ricas ni secciones de relleno.' },
        { title: 'Tiendas online', text: 'Tu cat\u00e1logo listo para mostrar productos, recibir pedidos y dar confianza antes de la compra.' },
        { title: 'SEO', text: 'Organizo tu web para que sea m\u00e1s f\u00e1cil encontrarte y para que cada p\u00e1gina tenga una intenci\u00f3n comercial.' },
        { title: 'Mantenimiento', text: 'Acompa\u00f1amiento cercano para cambios, mejoras, ajustes y soporte despu\u00e9s del lanzamiento.' },
      ],
      process: [['Hablamos', 'Revisamos tu oferta, tu cliente y lo que debe pasar despu\u00e9s de visitar la web.'], ['Dise\u00f1o', 'Defino una direcci\u00f3n visual fuerte, clara y alineada al tipo de cliente que quieres atraer.'], ['Construyo', 'Desarrollo una p\u00e1gina r\u00e1pida, responsive y lista para convertir inter\u00e9s en contacto.'], ['Lanzamos', 'Publicamos, probamos y dejamos todo preparado para que empieces a mover tu web.']],
      plans: [['Landing', 'Una p\u00e1gina directa para vender un servicio, promoci\u00f3n o campa\u00f1a puntual.'], ['Sitio completo', 'Una web completa para presentar tu negocio, servicios, casos y contacto.'], ['E-commerce', 'Una tienda clara para mostrar productos y abrir nuevos canales de venta.']],
      faqs: [['\u00bfTrabajas solo con negocios de Panam\u00e1?', 'Mi enfoque principal son negocios de Panam\u00e1 porque entiendo el mercado, la forma de vender y la cercan\u00eda que esperan los clientes.'], ['\u00bfNecesito tener textos e im\u00e1genes listos?', 'No. Puedo ayudarte a ordenar el mensaje, elegir qu\u00e9 mostrar y darle forma comercial a cada secci\u00f3n.'], ['\u00bfLa web se ver\u00e1 bien en celular?', 'S\u00ed. La experiencia se piensa primero para celular, porque ah\u00ed llega gran parte del tr\u00e1fico local.'], ['\u00bfPuedes mejorar una web existente?', 'S\u00ed. Puedo redise\u00f1arla, ordenar el contenido y convertirla en una herramienta m\u00e1s seria para vender.'], ['\u00bfQu\u00e9 pasa despu\u00e9s del lanzamiento?', 'Puedes mantener soporte conmigo para cambios, mejoras, ajustes y nuevas secciones cuando las necesites.']],
      stats: ['proyectos entregados', 'satisfacci\u00f3n buscada', 'respuesta inicial'],
    },
    en: {
      nav: ['Work', 'Services', 'Process', 'Plans'], contact: 'Contact', switch: 'ES',
      hero: 'Websites with visual direction, a clear message, and a focus on results for businesses in Panama.', idea: 'Share your idea', viewProjects: 'View projects',
      work: 'Work that feels serious from the first look.', servicesHeading: 'Services that help your business sell with more confidence.', processHeading: 'A direct, close process with no wasted time.',
      quote: '"I do not build pages to decorate the internet. I build a presence that makes your client trust you before they write."', quoteBy: 'Kevin Mena, personal web developer',
      plansHeading: 'Plans based on what you need to move.', planButton: 'Discuss project', faqHeading: 'Frequently asked questions.', contactHeading: 'Your business needs a website that takes the stage.', city: 'Panama',
      previousProject: 'Previous project', nextProject: 'Next project', viewProject: 'View larger image of', planLabel: 'Ask about plan',
      formName: 'Your name', formEmail: 'Your email', formBusiness: 'Your business name', formMessage: 'Tell me what you need', formSend: 'Send inquiry', formPlan: 'Plan of interest', formSending: 'Sending...', formSuccess: 'Your inquiry was sent. Kevin will reply soon.', formError: 'Your inquiry could not be sent. Please try again.',
      projects: [
        { title: 'An\u00edbal Rey de Corazones', category: 'Personal brand with commercial presence', image: 'assets/images/anibal.png' },
        { title: 'Industrial Conference', category: 'Website designed to attract companies', image: 'assets/images/jornada-industrial.png' },
        { title: 'La Casa del Jean', category: 'Digital showcase for local sales', image: 'assets/images/casa-jean.png' },
      ],
      services: [
        { title: 'Web design', text: 'A website with a strong presence, a clear message, and a path designed for visitors to contact you.' },
        { title: 'Custom development', text: 'I build the experience your business needs, without generic templates or filler sections.' },
        { title: 'Online stores', text: 'Your catalog ready to show products, receive orders, and build confidence before a purchase.' },
        { title: 'SEO', text: 'I organize your website so it is easier to find and every page serves a commercial purpose.' },
        { title: 'Maintenance', text: 'Close support for changes, improvements, updates, and help after launch.' },
      ],
      process: [['We talk', 'We review your offer, your client, and what should happen after someone visits your website.'], ['Design', 'I define a strong, clear visual direction aligned with the clients you want to attract.'], ['I build', 'I develop a fast, responsive website ready to turn interest into contact.'], ['We launch', 'We publish, test, and leave everything ready for you to start moving your website.']],
      plans: [['Landing page', 'A direct page to sell a service, promotion, or specific campaign.'], ['Complete website', 'A complete website to present your business, services, cases, and contact details.'], ['E-commerce', 'A clear online store to show products and open new sales channels.']],
      faqs: [['Do you work only with businesses in Panama?', 'My main focus is businesses in Panama because I understand the market, the way they sell, and the closeness clients expect.'], ['Do I need to have text and images ready?', 'No. I can help you organize the message, choose what to show, and shape each section commercially.'], ['Will the website look good on mobile?', 'Yes. The experience is designed for mobile first, because that is where much of the local traffic arrives.'], ['Can you improve an existing website?', 'Yes. I can redesign it, organize its content, and turn it into a more serious sales tool.'], ['What happens after launch?', 'You can keep support with me for changes, improvements, adjustments, and new sections when you need them.']],
      stats: ['projects delivered', 'target satisfaction', 'initial response'],
    },
  };

  protected readonly stats: Stat[] = [{ value: 4, suffix: '+', current: 0, animated: false }, { value: 100, suffix: '%', current: 0, animated: false }, { value: 24, suffix: 'h', current: 0, animated: false }];

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}
  ngAfterViewInit(): void { this.updateNav(); this.initScrollReveal(); this.initCounters(); }
  @HostListener('window:scroll') protected updateNav(): void { this.isScrolled.set(window.scrollY > 24); }
  protected content(): Content { return this.copy[this.language()]; }
  protected finishCurtainOpening(): void { this.curtainOpen.set(true); this.navVisible.set(true); }
  protected toggleLanguage(): void { this.language.update((value) => value === 'es' ? 'en' : 'es'); this.activeService.set(-1); }
  protected toggleService(index: number): void { this.activeService.set(this.activeService() === index ? -1 : index); }
  protected openContact(plan?: string): void {
    this.selectedPlan.set(plan ?? '');
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected async sendEmail(form: HTMLFormElement, name: string, email: string, business: string, message: string): Promise<void> {
    if (this.emailStatus() === 'sending') return;

    this.emailStatus.set('sending');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_ak4xprk',
          template_id: 'template_o5k4o9j',
          user_id: 'ClGvdEq4OxhPd2sL3',
          template_params: {
            from_name: name,
            from_email: email,
            reply_to: email,
            business_name: business,
            message,
            selected_plan: this.selectedPlan() || 'No seleccionado',
            to_email: 'kjmg2325@gmail.com',
          },
        }),
      });
      if (!response.ok) throw new Error('EmailJS request failed');
      form.reset();
      this.selectedPlan.set('');
      this.emailStatus.set('success');
    } catch {
      this.emailStatus.set('error');
    }
  }
  protected moveProjects(direction: number): void {
    const track = this.elementRef.nativeElement.querySelector<HTMLElement>('.project-track');
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.project-card');
    track.scrollBy({ left: direction * (card ? card.offsetWidth + 18 : track.clientWidth * 0.8), behavior: 'smooth' });
  }
  private initScrollReveal(): void {
    const items = this.elementRef.nativeElement.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') { items.forEach((item) => item.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.16, rootMargin: '0px 0px -80px 0px' });
    items.forEach((item, index) => { (item as HTMLElement).style.setProperty('--delay', `${Math.min(index % 6, 5) * 85}ms`); observer.observe(item); });
  }
  private initCounters(): void {
    const statsBlock = this.elementRef.nativeElement.querySelector('[data-stats]');
    if (!statsBlock) return;
    if (typeof IntersectionObserver === 'undefined') { setTimeout(() => this.stats.forEach((stat) => { stat.current = stat.value; stat.animated = true; })); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { this.stats.forEach((_, index) => this.animateStat(index)); observer.disconnect(); } }, { threshold: 0.35 });
    observer.observe(statsBlock);
  }
  private animateStat(index: number): void {
    const stat = this.stats[index]; if (stat.animated) return; stat.animated = true; const start = performance.now();
    const tick = (now: number) => { const progress = Math.min((now - start) / 1400, 1); stat.current = Math.round(stat.value * (1 - Math.pow(1 - progress, 3))); if (progress < 1) requestAnimationFrame(tick); else stat.current = stat.value; };
    requestAnimationFrame(tick);
  }
}
