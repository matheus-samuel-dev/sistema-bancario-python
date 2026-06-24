import styles from "./OperationCard.module.css";

export function OperationCard({
  title,
  subtitle,
  fields,
  buttonLabel,
  onSubmit
}) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const result = onSubmit(payload);

    if (result?.success) {
      event.currentTarget.reset();
    }
  }

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className={styles.field}>
            <span>{field.label}</span>
            {field.multiline ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                rows="3"
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                min={field.min}
                step={field.step}
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}

        <button className={styles.button} type="submit">
          {buttonLabel}
        </button>
      </form>
    </article>
  );
}
