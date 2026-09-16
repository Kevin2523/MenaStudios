import { Component, HostListener, OnInit, signal } from '@angular/core';

type Service = { number: string; title: string; text: string };
type Project = { category: string; title: string; image: string; url: string };
type Step = { number: string; title: string; text: string };

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly mobileMenuOpen = signal(false);
  protected readonly emailStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  protected readonly hasScrolled = signal(false);

  protected readonly services: Service[] = [
    { number: '01', title: 'Diseño web', text: 'Una presencia clara y profesional que hace que tu negocio se vea a la altura de lo que ofrece.' },
    { number: '02', title: 'Tiendas online', text: 'Una experiencia simple para mostrar productos, recibir pedidos y vender con confianza.' },
    { number: '03', title: 'Desarrollo a medida', text: 'Soluciones pensadas alrededor de tu operación, tus clientes y la forma en que quieres crecer.' },
    { number: '04', title: 'SEO y visibilidad', text: 'Páginas organizadas para ayudarte a aparecer cuando las personas buscan lo que haces.' },
    { number: '05', title: 'Soporte y mantenimiento', text: 'Acompañamiento cercano para que tu sitio siga actualizado, seguro y útil después del lanzamiento.' },
  ];

  protected readonly projects: Project[] = [
    { category: 'Marca personal', title: 'Aníbal Rey de Corazones', image: 'assets/images/anibal.png', url: 'https://anibalreydecorazones.com/' },
    { category: 'Evento industrial', title: 'Jornada Industrial', image: 'assets/images/jornada-industrial.png', url: 'https://jornadaindustrialcocle.utp.ac.pa/' },
    { category: 'Tienda online', title: 'La Casa del Jean', image: 'assets/images/casa-jean-capture.png', url: 'https://lacasadeljean.free.nf/?i=1' },
    { category: 'Portafolio personal', title: 'Kevin Mena', image: 'assets/images/portfolio-kevin.png', url: 'https://kevinmena.me/' },
  ];

  protected readonly steps: Step[] = [
    { number: '01', title: 'Conocemos tu negocio', text: 'Entendemos lo que vendes, a quién quieres atraer y qué debe pasar después de una visita.' },
    { number: '02', title: 'Diseñamos la experiencia', text: 'Ordenamos el mensaje y creamos una dirección visual que se sienta propia de tu marca.' },
    { number: '03', title: 'Desarrollamos tu web', text: 'Construimos una experiencia rápida, clara y pensada para funcionar igual de bien en celular.' },
    { number: '04', title: 'Lanzamos y mejoramos', text: 'Publicamos, revisamos los detalles y te acompañamos para que la web siga moviendo tu negocio.' },
  ];

  ngOnInit(): void {
    this.updateNavState();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.updateNavState();
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  private updateNavState(): void {
    this.hasScrolled.set(window.scrollY > 570);
  }

  protected goTo(sectionId: string): void {
    this.mobileMenuOpen.set(false);
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            to_email: 'kjmg2325@gmail.com',
          },
        }),
      });

      if (!response.ok) throw new Error('EmailJS request failed');
      form.reset();
      this.emailStatus.set('success');
    } catch {
      this.emailStatus.set('error');
    }
  }
}
