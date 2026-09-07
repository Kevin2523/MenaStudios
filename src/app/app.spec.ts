import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should connect navigation and project links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      expect(root.querySelector(link.getAttribute('href')!)).not.toBeNull();
    });
    expect(root.querySelectorAll('a.project-card').length).toBe(3);
    expect(root.querySelectorAll('.plan-card button').length).toBe(3);
    expect(root.querySelector('form.contact-form')).not.toBeNull();
  });

  it('should toggle services', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const buttons = fixture.nativeElement.querySelectorAll('.service-row') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the MenaStudios hero', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-logo')?.getAttribute('alt')).toContain('Mena Studios');
  });
});
