import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // On mount: load all articles and the category dropdown data
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    // Default list — GET /articles
    axios.get('http://localhost:5000/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  };

  const fetchCategories = async () => {
    // Q1 (EX-2) – GET /categories: populate the dropdown
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  const applyFilter = () => {
    if (!selectedCategoryId) {
      fetchArticles();
      return;
    }
    // Q3 – GET /categories/:id/articles: server-side filter by category
    axios.get(`http://localhost:5000/categories/${selectedCategoryId}/articles`)
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  };

  const resetFilter = () => {
    setSelectedCategoryId('');
    fetchArticles();
  };

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button onClick={applyFilter}>Apply Filters</button>
        <button onClick={resetFilter}>Reset Filters</button>
      </div>

      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button disabled>Delete</button>
            <button disabled>Update</button>
            <button disabled>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
