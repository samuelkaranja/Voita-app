export const generatePath = (
  width: number,
  height: number,
  tabWidth: number,
  index: number
) => {
  const center = tabWidth * index + tabWidth / 2;

  return `
    M0 0
    H${center - 40}
    C${center - 20} 0, ${center - 20} 40, ${center} 40
    C${center + 20} 40, ${center + 20} 0, ${center + 40} 0
    H${width}
    V${height}
    H0
    Z
  `;
};
