import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuSection {
  key: string;
  label: string;
  icon: string;
  basePath: string;
  items: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeSidebar = output<void>();
  openSidebar = output<void>();

  expanded = signal<Record<string, boolean>>({
    pje: true,
    odin: false,
    trema: false,
  });

  sections: MenuSection[] = [
    {
      key: 'pje',
      label: 'PJe',
      icon: 'bi-briefcase',
      basePath: '/pje',
      items: [
        { label: 'Dashboard', route: '/pje/dashboard' },
        { label: 'Painel de Gerenciamento', route: '/pje/management' },
        { label: 'Regras de Valida\u00e7\u00e3o', route: '/pje/rules' },
        { label: 'Hist\u00f3rico de Remo\u00e7\u00e3o', route: '/pje/removal-history' },
        { label: 'Grupos de Trabalho', route: '/pje/work-groups' },
      ],
    },
    {
      key: 'odin',
      label: 'ODIN',
      icon: 'bi-shield-lock',
      basePath: '/odin',
      items: [
        { label: 'Painel de Gerenciamento', route: '/odin/management' },
        { label: 'Regras do ODIN', route: '/odin/rules' },
      ],
    },
    {
      key: 'trema',
      label: 'TRE-MA (LDAP)',
      icon: 'bi-people',
      basePath: '/trema',
      items: [
        { label: 'Painel de Gerenciamento', route: '/trema/management' },
        { label: 'Hist\u00f3rico de Processamento', route: '/trema/processing-history' },
      ],
    },
  ];

  toggleSection(key: string): void {
    this.expanded.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  isSectionExpanded(key: string): boolean {
    return this.expanded()[key] ?? false;
  }

  onNavClick(): void {
    this.closeSidebar.emit();
  }
}
