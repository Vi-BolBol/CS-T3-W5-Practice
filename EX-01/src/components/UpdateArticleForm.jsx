import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });

  // Q4 – Prefill: GET /articles/:id to load existing data into the form
  useEffect(() => {
    axios.get(`http://localhost:5000/articles/${id}`)
      .then(res => {
        const { title, content, journalistId, categoryId } = res.data;
        setForm({ title, content, journalistId, categoryId });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Q4 – PUT /articles/:id: send updated data to the API
    try {
      await axios.put(`http://localhost:5000/articles/${id}`, {
        title: form.title,
        content: form.content,
        journalistId: Number(form.journalistId),
        categoryId: Number(form.categoryId),
      });
      // Go back to the article list after a successful update
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Article</h3>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
      <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
      <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
      <button type="submit">Update</button>
    </form>
  );
}
