export type CertificationLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;

export interface Artist {
  id: string;
  name: string;
  handle: string;
  genre: string;
  certification: CertificationLevel;
  subscribers: number;
  streams: number;
  verified: boolean;
  bio: string;
  imageColor: string; // gradient fallback color
  socialFb?: string;
  socialX?: string;
  location: string;
}

export interface Album {
  id: string;
  artistId: string;
  title: string;
  coverColor: string;
  year: number;
  priceXaf: number;
  isPreorder?: boolean;
  releaseDate?: string;
  trackCount: number;
  explicit?: boolean;
}

export interface Track {
  id: string;
  albumId: string;
  artistId: string;
  title: string;
  durationSec: number;
  priceXaf: number;
  explicit?: boolean;
  featuring?: string[];
  streams: number;
  monthlyStreams?: number;
  weeklyStreams?: number;
  lyrics?: string;
}

export const ARTISTS: Artist[] = [
  {
    id: 'lifka',
    name: 'LiFkA',
    handle: '@LiFkA',
    genre: 'Rap',
    certification: 'gold',
    subscribers: 402,
    streams: 9200,
    verified: true,
    bio: 'Rappeur camerounais, lyriciste reconnu comme le meilleur rap camerounais actuel.',
    imageColor: '#1a3a2a',
    socialFb: 'LiFkA',
    socialX: 'LiFkA',
    location: 'Yaoundé, Cameroun',
  },
  {
    id: 'mondo-mubany',
    name: 'MondoMubany',
    handle: '@MondoMubany',
    genre: 'Afrobeat',
    certification: 'platinum',
    subscribers: 1240,
    streams: 520000,
    verified: true,
    bio: 'Star de l\'Afrobeat camerounais avec des sonorités qui traversent les frontières.',
    imageColor: '#3a1a0a',
    location: 'Douala, Cameroun',
  },
  {
    id: '5thez',
    name: '5thezofficiel',
    handle: '@5thezofficiel',
    genre: 'Rap',
    certification: 'silver',
    subscribers: 389,
    streams: 67000,
    verified: true,
    bio: 'Flow incisif et textes percutants. La nouvelle génération du rap camerounais.',
    imageColor: '#0a1a3a',
    location: 'Yaoundé, Cameroun',
  },
  {
    id: 'lucideman',
    name: 'LUCIDEMAN',
    handle: '@LUCIDEMAN',
    genre: 'Rap',
    certification: 'silver',
    subscribers: 271,
    streams: 58000,
    verified: true,
    bio: 'Musique consciente et poésie urbaine. La voix de la rue camerounaise.',
    imageColor: '#1a0a3a',
    location: 'Bafoussam, Cameroun',
  },
  {
    id: 'jenny-ice',
    name: 'Jenny_Ice',
    handle: '@Jenny_Ice',
    genre: 'R&B',
    certification: 'bronze',
    subscribers: 156,
    streams: 18500,
    verified: true,
    bio: 'Voix cristalline et R&B chaleureux. La reine montante de la scène féminine camerounaise.',
    imageColor: '#3a0a1a',
    location: 'Douala, Cameroun',
  },
  {
    id: 'ngahrosine',
    name: 'Ngahrosine',
    handle: '@Ngahrosine',
    genre: 'Afropop',
    certification: 'gold',
    subscribers: 891,
    streams: 142000,
    verified: true,
    bio: 'Chanteuse afropop aux influences multiculturelles. Ambiance garantie.',
    imageColor: '#2a1a0a',
    location: 'Paris / Douala',
  },
  {
    id: 'cedriclam',
    name: 'CedricLaMouche',
    handle: '@CedricLaM',
    genre: 'Coupé-Décalé',
    certification: 'bronze',
    subscribers: 203,
    streams: 22000,
    verified: false,
    bio: 'Roi du dancefloor avec ses productions Coupé-Décalé électrisantes.',
    imageColor: '#0a2a1a',
    location: 'Yaoundé, Cameroun',
  },
  {
    id: 'coolh',
    name: 'COOLH',
    handle: '@COOLH',
    genre: 'Rap',
    certification: 'silver',
    subscribers: 445,
    streams: 73000,
    verified: true,
    bio: 'Nouvelles sonorités, flow unique. L\'un des rappeurs les plus innovants du pays.',
    imageColor: '#1a2a0a',
    location: 'Douala, Cameroun',
  },
  {
    id: 'pascal',
    name: 'Pascal',
    handle: '@pascal',
    genre: 'Gospel',
    certification: 'diamond',
    subscribers: 5400,
    streams: 1_450_000,
    verified: true,
    bio: 'L\'icône du Gospel camerounais. Voix inspirante, message universel.',
    imageColor: '#3a3a0a',
    location: 'Yaoundé, Cameroun',
  },
  {
    id: 'stevedo',
    name: 'Stevedo',
    handle: '@Stevedo',
    genre: 'Makossa',
    certification: 'platinum',
    subscribers: 2100,
    streams: 680000,
    verified: true,
    bio: 'Gardien du Makossa traditionnel modernisé. Légende vivante de la musique camerounaise.',
    imageColor: '#2a0a2a',
    location: 'Douala, Cameroun',
  },
  {
    id: 'mrbiyong',
    name: 'MrBiyong',
    handle: '@MrBiyong',
    genre: 'Afrobeat',
    certification: 'bronze',
    subscribers: 178,
    streams: 14200,
    verified: false,
    bio: 'Producteur et artiste, il mélange Afrobeat et sonorités locales pour créer quelque chose d\'unique.',
    imageColor: '#0a0a2a',
    location: 'Bafoussam, Cameroun',
  },
  {
    id: 'lili-anoma',
    name: 'Lili Anoma',
    handle: '@LiliAnoma',
    genre: 'R&B',
    certification: 'gold',
    subscribers: 723,
    streams: 134000,
    verified: true,
    bio: 'R&B aux accents africains. Sa voix transporte et ses textes touchent les cœurs.',
    imageColor: '#2a0a0a',
    location: 'Yaoundé, Cameroun',
  },
  {
    id: 'diablit',
    name: 'Diablit',
    handle: '@Diablit',
    genre: 'Rap',
    certification: 'silver',
    subscribers: 510,
    streams: 82000,
    verified: true,
    bio: 'Rappeur aux textes engagés, mêlant réalité camerounaise et flow percutant.',
    imageColor: '#0a1a2a',
    location: 'Douala, Cameroun',
  },
  {
    id: 'simba-draken',
    name: 'Simba Draken',
    handle: '@SimbaDraken',
    genre: 'Afrotrap',
    certification: 'bronze',
    subscribers: 290,
    streams: 31000,
    verified: true,
    bio: 'Afrotrap puissant avec des influences panafricaines. La fierté de Douala.',
    imageColor: '#2a1a0a',
    location: 'Douala, Cameroun',
  },
  {
    id: 'trois-off',
    name: 'Trois Officiel',
    handle: '@TroisOfficiel',
    genre: 'Rap',
    certification: 'gold',
    subscribers: 614,
    streams: 110000,
    verified: true,
    bio: 'Collectif rap camerounais alliant lyricisme, trap et culture de rue.',
    imageColor: '#1a0a2a',
    location: 'Yaoundé, Cameroun',
  },
];

export const ALBUMS: Album[] = [
  { id: 'nnpp', artistId: 'lifka', title: 'NON N\'AIE PAS PEUR', coverColor: '#1a3a2a', year: 2025, priceXaf: 3000, trackCount: 11, explicit: true },
  { id: 'nnpp-prelude', artistId: 'lifka', title: 'NNPP - PRELUDE', coverColor: '#2a3a1a', year: 2024, priceXaf: 1500, trackCount: 5, explicit: true },
  { id: 'kamikaz', artistId: 'lifka', title: 'KAMIKAZ', coverColor: '#3a2a1a', year: 2023, priceXaf: 2000, trackCount: 8, explicit: true },
  { id: 'mbebwo', artistId: 'mondo-mubany', title: 'MBEBWO THE ALBUM', coverColor: '#3a1a0a', year: 2025, priceXaf: 4000, trackCount: 14 },
  { id: 'toum-be-tara', artistId: '5thez', title: 'TOUM BE TARA', coverColor: '#0a1a3a', year: 2025, priceXaf: 2500, trackCount: 9 },
  { id: 'reset', artistId: 'lucideman', title: 'RESET', coverColor: '#1a0a3a', year: 2025, priceXaf: 2000, trackCount: 10, explicit: true },
  { id: 'bad', artistId: 'lili-anoma', title: 'BAD', coverColor: '#2a0a1a', year: 2025, priceXaf: 2000, trackCount: 7 },
  {
    id: 'upcoming-stevedo',
    artistId: 'stevedo',
    title: 'MAKOSSA FOREVER',
    coverColor: '#2a0a2a',
    year: 2026,
    priceXaf: 5000,
    trackCount: 12,
    isPreorder: true,
    releaseDate: '2026-05-22',
  },
  { id: 'diablit-ep', artistId: 'diablit', title: 'VRAI PARLER EP', coverColor: '#0a1a2a', year: 2025, priceXaf: 2500, trackCount: 6 },
  { id: 'simba-vol1', artistId: 'simba-draken', title: 'LION DEBOUT VOL.1', coverColor: '#2a1a0a', year: 2025, priceXaf: 2000, trackCount: 5 },
  { id: 'trois-ep', artistId: 'trois-off', title: 'CAMEROUN FIRST EP', coverColor: '#1a0a2a', year: 2025, priceXaf: 3000, trackCount: 7 },
];

export const TRACKS: Track[] = [
  {
    id: 'yt1', albumId: 'nnpp', artistId: 'lifka', title: 'INTRO', durationSec: 120, priceXaf: 500,
    streams: 4200, monthlyStreams: 1840, weeklyStreams: 420,
    lyrics: `Je suis là, encore debout\nMalgré la nuit, je vois le bout\nNon n'aie pas peur, l'avenir est grand\nJe construis mon destin, pas à pas, simplement\n\nOn m'a dit que j'allais tomber\nMais j'ai choisi de me relever\nChaque chute est une leçon\nChaque douleur est une raison`,
  },
  {
    id: 'yt2', albumId: 'nnpp', artistId: 'lifka', title: 'POSITION', durationSec: 218, priceXaf: 500, explicit: true, featuring: ['DOBY', 'RÉMI BETA'],
    streams: 8900, monthlyStreams: 3200, weeklyStreams: 890,
    lyrics: `Ma position, j'la tiens fort\nMême quand les autres me montrent la porte\nJ'avance seul sur ce chemin tordu\nMais je sais où je vais, t'inquiète je suis pas perdu\n\n[DOBY]\nTa position c'est le sommet\nOn regarde en bas, personne peut nous arrêter\n\n[RÉMI BETA]\nLa position c'est l'état d'esprit\nQuand la rue t'appelle, tu réponds la nuit`,
  },
  {
    id: 'yt3', albumId: 'nnpp', artistId: 'lifka', title: 'LA JOIE', durationSec: 195, priceXaf: 500,
    streams: 6100, monthlyStreams: 2100, weeklyStreams: 610,
    lyrics: `La joie est là, même dans la tempête\nMon sourire est une arme, ma paix est discrète\nJe danse sur les ruines de mes doutes passés\nLa joie c'est mon choix, jamais effacé\n\nIls cherchent le bonheur dans les choses matérielles\nMoi je l'ai trouvé dans les choses éternelles`,
  },
  {
    id: 'yt4', albumId: 'nnpp', artistId: 'lifka', title: 'SKIP', durationSec: 178, priceXaf: 500, featuring: ['SOJIP'],
    streams: 5400, monthlyStreams: 1900, weeklyStreams: 540,
    lyrics: `Skip, skip, skip les faux sourires\nSkip, skip, les gens qui font semblant de te suivre\nJe garde que les vrais autour de moi\nLe reste ? Skip.\n\n[SOJIP]\nJ'ai appris à trier, à garder le meilleur\nSkip les traîtres, skip la douleur`,
  },
  {
    id: 'yt5', albumId: 'nnpp', artistId: 'lifka', title: 'BEWA', durationSec: 204, priceXaf: 500,
    streams: 7200, monthlyStreams: 2800, weeklyStreams: 720,
    lyrics: `Bewa signifie viens — viens voir ce que j'ai bâti\nViens voir mes cicatrices, mes nuits infinies\nBewa, je t'attends au bout du chemin\nLà où la lumière commence enfin`,
  },
  {
    id: 'yt6', albumId: 'nnpp', artistId: 'lifka', title: 'MENTEUR', durationSec: 231, priceXaf: 500, explicit: true, featuring: ['KING ARTHUR'],
    streams: 12400, monthlyStreams: 4100, weeklyStreams: 1240,
    lyrics: `Menteur — tu m'as promis la vérité\nMenteur — tu m'as offert de l'obscurité\nJe te croyais, j'avais tort, c'est fini\nMes oreilles n'entendent plus tes jolis mensonges la nuit\n\n[KING ARTHUR]\nLes menteurs s'habillent de vérité\nMais la vérité finit toujours par éclater`,
  },
  {
    id: 'yt7', albumId: 'nnpp', artistId: 'lifka', title: 'YE WANDA', durationSec: 187, priceXaf: 500, explicit: true,
    streams: 15800, monthlyStreams: 5600, weeklyStreams: 1580,
    lyrics: `Ye wanda — qui l'aurait cru ?\nYe wanda — moi qui étais si peu connu\nAujourd'hui ma voix résonne\nYe wanda — Yaoundé me couronne\n\nDe la rue aux projecteurs\nDe l'ombre à la lueur\nYe wanda, ye wanda, le chemin était douleur`,
  },
  {
    id: 'yt8', albumId: 'nnpp', artistId: 'lifka', title: 'SOSUCAM', durationSec: 243, priceXaf: 500, featuring: ['AZ PRN', 'HORTARIEN'],
    streams: 9300, monthlyStreams: 3400, weeklyStreams: 930,
    lyrics: `Sosucam, Sosucam — la sucrerie de nos vies\nOn travaille dans les champs, on récupère peu la nuit\nMais nos rêves sont grands, plus larges que les cieux\nSosucam ne définit pas nos ambitions\n\n[AZ PRN]\nDe Sosucam à Paris, j'ai tout traversé\nMes valises étaient lourdes mais j'ai pas lâché`,
  },
  { id: 'm1', albumId: 'mbebwo', artistId: 'mondo-mubany', title: 'MBEBWO THE ALBUM', durationSec: 245, priceXaf: 500, streams: 89000, monthlyStreams: 28000, weeklyStreams: 7200 },
  { id: 't1', albumId: 'toum-be-tara', artistId: '5thez', title: 'TOUM BE TARA', durationSec: 198, priceXaf: 500, streams: 34000, monthlyStreams: 9800, weeklyStreams: 2400 },
  { id: 'r1', albumId: 'reset', artistId: 'lucideman', title: 'RESET', durationSec: 212, priceXaf: 500, streams: 28000, monthlyStreams: 7600, weeklyStreams: 1800 },
  { id: 'd1', albumId: 'diablit-ep', artistId: 'diablit', title: 'VRAI PARLER', durationSec: 207, priceXaf: 500, streams: 48000, monthlyStreams: 14200, weeklyStreams: 3600 },
  { id: 'd2', albumId: 'diablit-ep', artistId: 'diablit', title: 'AUTOPSIE', durationSec: 193, priceXaf: 500, explicit: true, streams: 34000, monthlyStreams: 9800, weeklyStreams: 2400 },
  { id: 's1', albumId: 'simba-vol1', artistId: 'simba-draken', title: 'LION DEBOUT', durationSec: 218, priceXaf: 500, streams: 31000, monthlyStreams: 8900, weeklyStreams: 2100 },
  { id: 'tr1', albumId: 'trois-ep', artistId: 'trois-off', title: 'UNION', durationSec: 234, priceXaf: 500, featuring: ['LiFkA'], streams: 68000, monthlyStreams: 22000, weeklyStreams: 5800 },
  { id: 'tr2', albumId: 'trois-ep', artistId: 'trois-off', title: 'CAMEROUN FIRST', durationSec: 201, priceXaf: 500, streams: 42000, monthlyStreams: 12400, weeklyStreams: 3100 },
];

export const GENRES = [
  'Tout', 'Afrobeat', 'Makossa', 'Bikutsi', 'Rap', 'R&B', 'Gospel', 'Coupé-Décalé',
];

export const NEWS = [
  {
    id: 'n1',
    source: 'Nkongsamba Hip-Hop Magazine',
    headline: 'LiFkA : Le meilleur lyriciste rap camerounais actuellement',
    body: 'Avec son album NNPP, LiFkA s\'impose comme la référence incontestable du rap camerounais de cette génération.',
    imageColor: '#1a2a1a',
    timeAgo: '6h',
    tag: 'Hip-Hop',
  },
  {
    id: 'n2',
    source: 'NKUMU Editorial',
    headline: 'CAMUCA : MondoMubany certifié Platine — 500K streams franchis',
    body: 'MondoMubany rejoint le cercle très fermé des artistes certifiés Platine par la CAMUCA. Une première pour l\'Afrobeat camerounais.',
    imageColor: '#3a1a0a',
    timeAgo: '1j',
    tag: 'Certifications',
  },
  {
    id: 'n3',
    source: 'NKUMU Editorial',
    headline: 'CAMAS 2026 : La liste des nominations dévoilée',
    body: 'Les Cameroonian Music Awards et Streamings récompensent le meilleur de la musique camerounaise. Découvrez les nominés de cette édition.',
    imageColor: '#2a0a2a',
    timeAgo: '2j',
    tag: 'CAMAS Awards',
  },
  {
    id: 'n4',
    source: 'Cameroon Music Mag',
    headline: 'Stevedo annonce son retour : \'Makossa Forever\' en pré-commande',
    body: 'La légende du Makossa revient avec un album très attendu. Disponible en pré-commande exclusivement sur NKUMU.',
    imageColor: '#2a0a2a',
    timeAgo: '3j',
    tag: 'Makossa',
  },
  {
    id: 'n5',
    source: 'NKUMU Editorial',
    headline: 'Pascal franchit le million — premier Diamond certifié CAMUCA',
    body: 'Le roi du Gospel camerounais devient le premier artiste à atteindre le statut Diamond avec 1,45 million de streams certifiés.',
    imageColor: '#3a3a0a',
    timeAgo: '5j',
    tag: 'Gospel',
  },
];
