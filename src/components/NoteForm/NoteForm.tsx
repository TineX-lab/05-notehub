import { useFormik } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: { title: string; content: string; tag: string }) => void;
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  content: Yup.string().max(500, "Too Long!"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const formik = useFormik({
    initialValues: { title: "", content: "", tag: "Todo" },
    validationSchema: NoteSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        {formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={formik.isSubmitting}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
