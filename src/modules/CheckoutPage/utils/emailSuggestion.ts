const POPULAR_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
];

const KNOWN_DOMAINS = [
  ...POPULAR_DOMAINS,
  'mail.com',
  'me.com',
  'mac.com',
  'live.com',
  'msn.com',
  'aol.com',
  'gmx.com',
  'proton.me',
  'protonmail.com',
  'ymail.com',
];

const MAX_DISTANCE = 2;

const getDistance = (first: string, second: string) => {
  let previous = Array.from({ length: second.length + 1 }, (_, index) => index);

  first.split('').forEach((firstChar, row) => {
    const current = [row + 1];

    second.split('').forEach((secondChar, column) => {
      const cost = firstChar === secondChar ? 0 : 1;

      current.push(
        Math.min(
          previous[column + 1] + 1,
          current[column] + 1,
          previous[column] + cost,
        ),
      );
    });

    previous = current;
  });

  return previous[second.length];
};

export const getEmailSuggestion = (email: string) => {
  const value = email.trim();
  const atIndex = value.lastIndexOf('@');

  if (atIndex < 1) {
    return null;
  }

  const user = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1).toLowerCase();

  if (!domain || KNOWN_DOMAINS.includes(domain)) {
    return null;
  }

  const closest = POPULAR_DOMAINS.map(popular => ({
    popular,
    distance: getDistance(domain, popular),
  })).sort((first, second) => first.distance - second.distance)[0];

  return closest.distance <= MAX_DISTANCE ? `${user}@${closest.popular}` : null;
};
