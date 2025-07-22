export interface TagParts {
  site: 'fur4' | 'refer';
  module?: string;
  caseId?: string; // numeric part only like '001'
}

export const buildTag = ({ site, module, caseId }: TagParts): string => {
  const tags = [];
  tags.push(`@site:${site}`);
  if (module) tags.push(`@${site}:${module.toLowerCase()}`);
  if (caseId) tags.push(`@${site}:${caseId}`);
  return tags.join(' ');
}; 