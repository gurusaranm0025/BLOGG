function Logo({ className }) {
  return (
    <span
      className={
        "text-4xl font-logo bg-logo-gradient bg-clip-text text-transparent " +
        className
      }
    >
      BLOOM
    </span>
  );
}

export default Logo;
