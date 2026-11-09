import { readFileSync } from 'node:fs';
export const BASE = 'https://justuseflint.github.io/bt-quail-farm/';
export const CHECKED = 'Nov 9, 2026';
export const FB = 'https://www.facebook.com/people/B-T-Quail-Farm/61564725734105/';
export const PEOPLE = [
  { id: 'ethan', name: 'Ethan', phone: '765-720-4896', e164: '+17657204896' },
  { id: 'trevor', name: 'Trevor', phone: '765-246-1964', e164: '+17652461964' },
];
export const DIMS = JSON.parse(readFileSync(new URL('./dims.json', import.meta.url)));
export const V = JSON.parse(readFileSync(new URL('./vec.json', import.meta.url)));
export const SRC = {
  msuInc: ['Mississippi State Extension, incubation periods', 'https://extension.msstate.edu/agriculture/livestock/poultry/incubation-duration-periods'],
  msuRaise: ['MSU Extension, Raising Bobwhite Quail for Commercial Use (PDF)', 'https://www.poultry.msstate.edu/pdf/extension/raising_quail.pdf'],
  ext: ['Extension: Raising Bobwhite Quail, Small and Backyard Flock', 'https://poultry.extension.org/articles/poultry-management/raising-bobwhite-quail-small-and-backyard-flock/'],
  gundog: ['Gun Dog magazine, raising quail', 'https://www.gundogmag.com/editorial/pros-cons-raising-quail/543529'],
  nbgi: ['National Bobwhite & Grassland Initiative, life history', 'https://nbgi.org/bobwhites/life-history/'],
  nbgiPen: ['NBGI, on pen-raised quail and habitat', 'https://nbgi.org/2013/10/31/shells-covert-on-science-pen-raised-quail-hope/'],
  dnrGB: ['Indiana DNR, Game Breeder’s License information (PDF)', 'https://www.in.gov/dnr/fish-and-wildlife/files/fw-game-breeder-license-information.pdf'],
  dtg: ['312 IAC 9-10-16, Dog training ground permit', 'https://www.law.cornell.edu/regulations/indiana/312-IAC-9-10-16'],
  gb: ['312 IAC 9-10-4, Game breeder’s licenses', 'https://www.law.cornell.edu/regulations/indiana/312-IAC-9-10-4'],
  ccgc: ['Crooked Creek Gun Club, “Places for game birds”', 'https://www.crookedcreekgunclub.org/news.html'],
};
