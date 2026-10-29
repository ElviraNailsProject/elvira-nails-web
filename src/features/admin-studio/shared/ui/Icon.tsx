import styles from "./Icon.module.css";

export function Icon({ name }: { name: string }) {
  return (
    // Decorative assets keep their original dimensions; the enclosing control supplies its label.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.icon}
      alt=""
      aria-hidden="true"
      src={`/admin/icons/${name.replace(/\.svg$/, "")}.svg`}
    />
  );
}
