import * as simpleIcons from 'simple-icons';

export default function SimpleIcon({ simpleIcon, size = 32, fill = "#f00" }) {
  if (!simpleIcon || typeof simpleIcon !== 'string') {
    return <span>Invalid icon name</span>;
  }

  const iconKey = 'si' + simpleIcon.charAt(0).toUpperCase() + simpleIcon.slice(1).toLowerCase();
  const icon = simpleIcons[iconKey];

  if (!icon) {
    return <span> Icon not found</span>;
  }

  // Replace the fill in the SVG with the passed fill prop
  const svgWithFill = icon.svg.replace(/fill=".*?"/g, `fill="${fill}"`);

  return (
    <div
      title={icon.title}
      dangerouslySetInnerHTML={{ __html: svgWithFill }}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
      }}
    />
  );
}
