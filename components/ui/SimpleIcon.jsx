import * as simpleIcons from 'simple-icons';

export default function SimpleIcon({ simpleIcon, size = 17 }) {
  if (!simpleIcon || typeof simpleIcon !== 'string') {
    return <span>Invalid icon name</span>;
  }

  // More robust way: find by title
  const icon = Object.values(simpleIcons).find(
    (i) => i.title.toLowerCase() === simpleIcon.toLowerCase()
  );

  if (!icon) {
    return <span>Icon not found</span>;
  }

  const svgWithFill = icon.svg
    .replace(/fill="[^"]*"/g, '')
    .replace(/<path /g, `<path fill="currentColor" `);

  return (
    <div
      className="icon-box"
      title={icon.title}
      dangerouslySetInnerHTML={{ __html: svgWithFill }}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        color: 'inherit',
      }}
    />
  );
}
