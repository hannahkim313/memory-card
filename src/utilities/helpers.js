const getRandomIntInclusive = (min, max, indices) => {
  const minInclusive = Math.ceil(min);
  const maxInclusive = Math.floor(max);

  const int = Math.floor(
    Math.random() * (maxInclusive - minInclusive + 1) + minInclusive
  );

  if (indices.includes(int)) {
    return getRandomIntInclusive(min, max, indices);
  }

  return int;
};

export default getRandomIntInclusive;
