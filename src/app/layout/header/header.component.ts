import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

/**
 * Cabeçalho de aplicação fixo no topo.
 *
 * Layout em dois blocos (space-between):
 *  - Esquerda: logo + nome do sistema + versão
 *  - Direita: avatar + nome do usuário + tempo de sessão + logout
 *
 * Identidade visual baseada nos tokens CSS globais de `src/styles.scss`
 * (`--color-primary`, `--color-border`, `--color-text-*`, etc.) — não
 * introduz paleta própria.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /** Nome do sistema exibido ao lado do logo. */
  systemName = input<string>('Nome do Sistema');

  /** Versão exibida abaixo do nome (o prefixo "V. " já é aplicado no template). */
  version = input<string>('1.0.0');

  /** Nome do usuário autenticado. */
  userName = input<string>('Nome do Usuário');

  /** URL opcional do avatar; ausente ⇒ renderiza iniciais. */
  userAvatarUrl = input<string | null>(null);

  /** Segundos já decorridos da sessão quando o componente é montado. */
  initialSessionSeconds = input<number>(0);

  /** Estado atual da sidebar — controla o ícone do botão de toggle. */
  sidebarOpen = input<boolean>(false);

  /** Dispara ao clicar no botão de alternar a sidebar. */
  toggleSidebar = output<void>();

  /** Dispara ao clicar em "Sair". Consumidor executa o logout efetivo. */
  logout = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly elapsed = signal(this.initialSessionSeconds());

  /** Cronômetro `HH:MM:SS` reativo, atualizado a cada segundo. */
  readonly sessionTime = computed(() => this.formatDuration(this.elapsed()));

  /** Iniciais derivadas do nome do usuário para o fallback do avatar. */
  readonly userInitials = computed(() => this.extractInitials(this.userName()));

  constructor() {
    this.elapsed.set(this.initialSessionSeconds());
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.elapsed.update((s) => s + 1));
  }

  onLogout(): void {
    this.logout.emit();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  private formatDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  private extractInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
  }
}
