export interface ClientLogo {
  id: string;
  name: string;
  englishName?: string;
  logo: string; // Image URL or base64 data URI
  industry: string;
  website?: string;
  isActive: boolean;
  order: number;
  since?: string;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'atlas_clients_logos_v2';
const EVENT_NAME = 'atlas_clients_updated';

// Default Iranian industrial clients (Transparent background SVGs for clean white strip)
const DEFAULT_CLIENTS: ClientLogo[] = [
  {
    id: 'client-1',
    name: 'مجتمع فولاد مبارکه',
    englishName: 'Mobarakeh Steel Co.',
    industry: 'فولاد و متالورژی',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><path d="M36 22 L58 22 L47 44 Z M41 47 L53 47 L47 60 Z" fill="%23E06518"/><circle cx="47" cy="40" r="23" fill="none" stroke="%23E06518" stroke-width="3"/><text x="140" y="38" fill="%231E293B" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">فولاد مبارکه</text><text x="140" y="56" fill="%2364748B" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">MOBARAKEH STEEL</text></svg>',
    website: 'https://msc.ir',
    isActive: true,
    order: 1,
    since: '۱۳۹۲',
    notes: 'تأمین تسمه‌های نقاله سنگین و کوپلینگ‌های خط نورد گرم',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'client-2',
    name: 'صنایع کاشی تبریز',
    englishName: 'Tabriz Tile Group',
    industry: 'کاشی و سرامیک',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><rect x="31" y="24" width="32" height="32" rx="6" fill="%232563EB" transform="rotate(45 47 40)"/><rect x="38" y="31" width="18" height="18" rx="3" fill="%2360A5FA" transform="rotate(45 47 40)"/><text x="140" y="38" fill="%231E293B" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">کاشی تبریز</text><text x="140" y="56" fill="%232563EB" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">TABRIZ TILE GROUP</text></svg>',
    website: 'https://tabriztile.com',
    isActive: true,
    order: 2,
    since: '۱۳۹۴',
    notes: 'تسمه‌های ضدسایش و پولی‌های خطوط لعاب‌کاری',
    createdAt: '2026-01-12T11:00:00Z',
  },
  {
    id: 'client-3',
    name: 'سیمان سپهر یزد',
    englishName: 'Yazd Sepehr Cement',
    industry: 'صنعت سیمان',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><path d="M47 16 L28 58 L66 58 Z" fill="%23334155"/><path d="M47 26 L36 58 L58 58 Z" fill="%23F97316"/><text x="140" y="38" fill="%231E293B" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">سیمان سپهر یزد</text><text x="140" y="56" fill="%2364748B" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">YAZD CEMENT CO.</text></svg>',
    website: 'https://yazdcement.com',
    isActive: true,
    order: 3,
    since: '۱۳۹۰',
    notes: 'تسمه‌های الواتور و زنجیرهای انتقال حرارت بالا',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'client-4',
    name: 'کاشی و سرامیک عقیق',
    englishName: 'Aghigh Tile',
    industry: 'کاشی و سرامیک',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><circle cx="47" cy="40" r="20" fill="%23DC2626"/><circle cx="47" cy="40" r="11" fill="%23FFFFFF"/><path d="M47 23 L47 57 M30 40 L64 40" stroke="%23DC2626" stroke-width="3"/><text x="140" y="38" fill="%23DC2626" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">کاشی عقیق</text><text x="140" y="56" fill="%2364748B" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">AGHIGH CERAMICS</text></svg>',
    website: 'https://aghighceramtile.com',
    isActive: true,
    order: 4,
    since: '۱۳۹۵',
    notes: 'تسمه‌های پلی‌اورتان و رولرهای سرامیکی',
    createdAt: '2026-01-20T14:00:00Z',
  },
  {
    id: 'client-5',
    name: 'داروسازی دکتر عبیدی',
    englishName: 'Dr. Abidi Pharma',
    industry: 'دارویی و بهداشتی',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><rect x="27" y="20" width="40" height="40" rx="20" fill="%230284C7"/><path d="M39 40 L55 40 M47 32 L47 48" stroke="%23FFFFFF" stroke-width="4" stroke-linecap="round"/><text x="140" y="38" fill="%230284C7" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">داروسازی عبیدی</text><text x="140" y="56" fill="%2364748B" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">DR. ABIDI PHARMA</text></svg>',
    website: 'https://abidipharma.com',
    isActive: true,
    order: 5,
    since: '۱۳۹۸',
    notes: 'تسمه‌های بهداشتی درجه فود‌گرید FDA و پولی‌های استیل ضدزنگ',
    createdAt: '2026-02-01T15:20:00Z',
  },
  {
    id: 'client-6',
    name: 'نساجی بروجرد',
    englishName: 'Boroujerd Textile',
    industry: 'صنعت نساجی',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><path d="M30 50 Q47 16 64 50 Q47 64 30 50" fill="none" stroke="%237C3AED" stroke-width="3.5"/><circle cx="47" cy="40" r="6" fill="%23E06518"/><text x="140" y="38" fill="%231E293B" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">نساجی بروجرد</text><text x="140" y="56" fill="%237C3AED" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">BOROUJERD TEXTILE</text></svg>',
    website: 'https://boroujerdtextile.com',
    isActive: true,
    order: 6,
    since: '۱۳۹۳',
    notes: 'تسمه‌های اسپیندل و تسمه‌های تخت سرعت بالا',
    createdAt: '2026-02-05T08:45:00Z',
  },
  {
    id: 'client-7',
    name: 'پتروشیمی مارون',
    englishName: 'Marun Petrochemical',
    industry: 'صنایع پتروشیمی',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><circle cx="47" cy="40" r="20" fill="none" stroke="%230891B2" stroke-width="3" stroke-dasharray="5,3"/><circle cx="47" cy="40" r="9" fill="%23E06518"/><text x="140" y="38" fill="%230F172A" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">پتروشیمی مارون</text><text x="140" y="56" fill="%230891B2" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">MARUN PETROCHEM</text></svg>',
    website: 'https://mpc.ir',
    isActive: true,
    order: 7,
    since: '۱۳۹۷',
    notes: 'تسمه‌های ضداستاتیک و قطعات ضدخوردگی شیمیایی',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'client-8',
    name: 'گروه صنعتی زر (زر ماکارون)',
    englishName: 'Zar Industrial Group',
    industry: 'صنایع غذایی و تبدیلی',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><path d="M33 54 C33 28, 61 28, 61 54 Z" fill="%23D97706"/><circle cx="47" cy="24" r="5" fill="%23DC2626"/><text x="140" y="38" fill="%23B45309" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">گروه صنعتی زر</text><text x="140" y="56" fill="%2364748B" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">ZAR INDUSTRIAL GROUP</text></svg>',
    website: 'https://zargroup.ir',
    isActive: true,
    order: 8,
    since: '۱۳۹۶',
    notes: 'تسمه‌های مدولار پلاستیکی و خطوط بسته‌بندی پیوسته',
    createdAt: '2026-02-14T16:00:00Z',
  },
  {
    id: 'client-9',
    name: 'صنایع کاشی مرجان',
    englishName: 'Marjan Tile Co.',
    industry: 'کاشی و سرامیک',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80" width="220" height="80"><path d="M33 26 H61 V54 H33 Z" fill="none" stroke="%23E11D48" stroke-width="3"/><circle cx="47" cy="40" r="7" fill="%23E06518"/><text x="140" y="38" fill="%231E293B" font-family="sans-serif" font-weight="900" font-size="15" text-anchor="middle">کاشی مرجان</text><text x="140" y="56" fill="%23E11D48" font-family="sans-serif" font-weight="700" font-size="9.5" letter-spacing="1" text-anchor="middle">MARJAN TILE CO.</text></svg>',
    website: 'https://marjantile.com',
    isActive: true,
    order: 9,
    since: '۱۳۹۱',
    notes: 'تسمه‌های وی‌بلت صنعتی و زنجیرهای خطوط پرس',
    createdAt: '2026-02-18T10:00:00Z',
  },
];

class ClientService {
  private getStorage(): ClientLogo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveStorage(DEFAULT_CLIENTS);
        return DEFAULT_CLIENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CLIENTS;
    }
  }

  private saveStorage(clients: ClientLogo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_NAME));
      }
    } catch (e) {
      console.error('Failed to save clients in localStorage', e);
    }
  }

  /**
   * Get all clients (sorted by order)
   */
  public getAllClients(): ClientLogo[] {
    const clients = this.getStorage();
    return [...clients].sort((a, b) => a.order - b.order);
  }

  /**
   * Get active clients for homepage carousel
   */
  public getActiveClients(): ClientLogo[] {
    return this.getAllClients().filter(c => c.isActive);
  }

  /**
   * Add a new client
   */
  public addClient(client: Omit<ClientLogo, 'id' | 'createdAt'>): ClientLogo {
    const clients = this.getStorage();
    const newClient: ClientLogo = {
      ...client,
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    clients.push(newClient);
    this.saveStorage(clients);
    return newClient;
  }

  /**
   * Update an existing client
   */
  public updateClient(id: string, updates: Partial<ClientLogo>): ClientLogo | null {
    const clients = this.getStorage();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    clients[index] = { ...clients[index], ...updates };
    this.saveStorage(clients);
    return clients[index];
  }

  /**
   * Delete a client
   */
  public deleteClient(id: string): boolean {
    const clients = this.getStorage();
    const filtered = clients.filter(c => c.id !== id);
    if (filtered.length === clients.length) return false;

    this.saveStorage(filtered);
    return true;
  }

  /**
   * Reorder clients
   */
  public reorderClients(orderedIds: string[]): void {
    const clients = this.getStorage();
    const clientMap = new Map(clients.map(c => [c.id, c]));

    const reordered: ClientLogo[] = [];
    orderedIds.forEach((id, index) => {
      const c = clientMap.get(id);
      if (c) {
        reordered.push({ ...c, order: index + 1 });
        clientMap.delete(id);
      }
    });

    // Append any remaining clients
    clientMap.forEach(c => {
      reordered.push({ ...c, order: reordered.length + 1 });
    });

    this.saveStorage(reordered);
  }

  /**
   * Reset to default industrial clients
   */
  public resetToDefaults(): ClientLogo[] {
    this.saveStorage(DEFAULT_CLIENTS);
    return DEFAULT_CLIENTS;
  }

  /**
   * Subscribe to client updates
   */
  public subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(EVENT_NAME, callback);
    return () => window.removeEventListener(EVENT_NAME, callback);
  }
}

export const clientService = new ClientService();
