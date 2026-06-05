import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // On mount: load all three data sets
  useEffect(() => {
    fetchArticles();
    fetchJournalists();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    // Q1 (EX-2) – GET /articles
    axios.get('http://localhost:5000/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  };

  const fetchJournalists = async () => {
    // Q1 (EX-2) – GET /journalists
    axios.get('http://localhost:5000/journalists')
      .then(res => setJournalists(res.data))
      .catch(err => console.error(err));
  };

  const fetchCategories = async () => {
    // Q1 (EX-2) – GET /categories
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  const applyFilter = () => {
    if (!selectedJournalistId && !selectedCategoryId) {
      // No filters selected — show all articles
      fetchArticles();
      return;
    }

    // Q4 BONUS – Combined filter using query parameters
    // Requires backend support: GET /articles?journalistId=X&categoryId=Y
    if (selectedJournalistId && selectedCategoryId) {
      axios.get('http://localhost:5000/articles', {
        params: {
          journalistId: selectedJournalistId,
          categoryId: selectedCategoryId,
        },
      })
        .then(res => setArticles(res.data))
        .catch(err => console.error(err));
      return;
    }

    // Single filter: journalist only
    if (selectedJournalistId) {
      axios.get(`http://localhost:5000/journalists/${selectedJournalistId}/articles`)
        .then(res => setArticles(res.data))
        .catch(err => console.error(err));
      return;
    }

    // Single filter: category only
    if (selectedCategoryId) {
      axios.get(`http://localhost:5000/categories/${selectedCategoryId}/articles`)
        .then(res => setArticles(res.data))
        .catch(err => console.error(err));
    }
  };

  const resetFilter = () => {
    setSelectedJournalistId('');
    setSelectedCategoryId('');
    fetchArticles();
  };

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalistId}
          onChange={e => setSelectedJournalistId(e.target.value)}
        >
          <option value="">All Journalists</option>
          {journalists.map(j => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </select>

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
