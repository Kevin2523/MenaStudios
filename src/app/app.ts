import { AfterViewInit, Component, ElementRef, HostListener, signal } from '@angular/core';

type Stat = {
  label: string;
  value: number;
  suffix: string;
  current: number;
  animated: boolean;
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly isScrolled = signal(false);
  protected readonly activeService = signal(0);

  protected readonly notes = [
    'Web que vende',
    'Panama first',
    'Cercania real',
    'Mas mensajes',
    'Calidad visual',
    'Lanzamos rapido',
    'Sin vueltas',
    'Hecho por Kevin',
  ];

  protected readonly services = [
    {
      title: 'Diseno web',
      text: 'Una pagina con presencia fuerte, mensaje claro y una ruta pensada para que el visitante te contacte.',
    },
    {
      title: 'Desarrollo a medida',
      text: 'Construyo la experiencia que tu negocio necesita, sin plantillas genericas ni secciones de relleno.',
    },
    {
      title: 'Tiendas online',
      text: 'Tu catalogo listo para mostrar productos, recibir pedidos y dar confianza antes de la compra.',
    },
    {
      title: 'SEO',
      text: 'Organizo tu web para que sea mas facil encontrarte y para que cada pagina tenga una intencion comercial.',
    },
    {
      title: 'Google Ads',
      text: 'Campanas enfocadas en generar llamadas, WhatsApps y prospectos reales para tu negocio.',
    },
    {
      title: 'Mantenimiento',
      text: 'Acompanamiento cercano para cambios, mejoras, ajustes y soporte despues del lanzamiento.',
    },
  ];

  protected readonly projects = [
    {
      title: 'Anibal Rey de Corazones',
      category: 'Marca personal con presencia comercial',
      image: 'assets/images/anibal.png',
    },
    {
      title: 'Jornada Industrial',
      category: 'Sitio para atraer empresas',
      image: 'assets/images/jornada-industrial.png',
    },
    {
      title: 'La Casa del Jean',
      category: 'Escaparate digital para venta local',
      image: 'assets/images/casa-jean.png',
    },
  ];

  protected readonly process = [
    ['Hablamos', 'Revisamos tu oferta, tu cliente y lo que debe pasar despues de visitar la web.'],
    ['Diseno', 'Defino una direccion visual fuerte, clara y alineada al tipo de cliente que quieres atraer.'],
    ['Construyo', 'Desarrollo una pagina rapida, responsive y lista para convertir interes en contacto.'],
    ['Lanzamos', 'Publicamos, probamos y dejamos todo preparado para que empieces a mover tu web.'],
  ];

  protected readonly plans = [
    ['Landing', 'Una pagina directa para vender un servicio, promocion o campana puntual.'],
    ['Sitio completo', 'Una web completa para presentar tu negocio, servicios, casos y contacto.'],
    ['E-commerce', 'Una tienda clara para mostrar productos, recibir pedidos y abrir nuevos canales de venta.'],
  ];

  protected readonly faqs = [
    ['Trabajas solo con negocios de Panama?', 'Mi enfoque principal son negocios de Panama porque entiendo el mercado, la forma de vender y la cercania que esperan los clientes.'],
    ['Necesito tener textos e imagenes listos?', 'No. Puedo ayudarte a ordenar el mensaje, elegir que mostrar y darle forma comercial a cada seccion.'],
    ['La web se vera bien en celular?', 'Si. La experiencia se piensa primero para celular, porque ahi llega gran parte del trafico local.'],
    ['Puedes mejorar una web existente?', 'Si. Puedo redisenarla, ordenar el contenido y convertirla en una herramienta mas seria para vender.'],
    ['Que pasa despues del lanzamiento?', 'Puedes mantener soporte conmigo para cambios, mejoras, ajustes y nuevas secciones cuando las necesites.'],
  ];

  protected stats: Stat[] = [
    { label: 'proyectos entregados', value: 4, suffix: '+', current: 0, animated: false },
    { label: 'satisfaccion buscada', value: 100, suffix: '%', current: 0, animated: false },
    { label: 'respuesta inicial', value: 24, suffix: 'h', current: 0, animated: false },
  ];

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.updateNav();
    this.initScrollReveal();
    this.initCounters();
  }

  @HostListener('window:scroll')
  protected updateNav(): void {
    this.isScrolled.set(window.scrollY > 24);
  }

  protected toggleService(index: number): void {
    this.activeService.set(this.activeService() === index ? -1 : index);
  }

  private initScrollReveal(): void {
    const items = this.elementRef.nativeElement.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -80px 0px' },
    );

    items.forEach((item, index) => {
      (item as HTMLElement).style.setProperty('--delay', `${Math.min(index % 6, 5) * 85}ms`);
      observer.observe(item);
    });
  }

  private initCounters(): void {
    const statsBlock = this.elementRef.nativeElement.querySelector('[data-stats]');
    if (!statsBlock) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setTimeout(() => {
        this.stats.forEach((stat) => {
          stat.current = stat.value;
          stat.animated = true;
        });
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.stats.forEach((_, index) => this.animateStat(index));
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(statsBlock);
  }

  private animateStat(index: number): void {
    const stat = this.stats[index];
    if (stat.animated) {
      return;
    }

    stat.animated = true;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.current = Math.round(stat.value * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        stat.current = stat.value;
      }
    };

    requestAnimationFrame(tick);
  }
}
