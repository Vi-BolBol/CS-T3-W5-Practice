import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByJournalist() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');

  // On mount: load all articles and the journalist dropdown data
  useEffect(() => {
    fetchArticles();
    fetchJournalists();
  }, []);

  const fetchArticles = async () => {
    // Q1 (EX-2) – GET /articles: default list shown before any filter is applied
    axios.get('http://localhost:5000/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  };

  const fetchJournalists = async () => {
    // Q1 (EX-2) – GET /journalists: populate the dropdown
    axios.get('http://localhost:5000/journalists')
      .then(res => setJournalists(res.data))
      .catch(err => console.error(err));
  };

  const applyFilter = () => {
    if (!selectedJournalistId) {
      // No journalist selected — show all articles
      fetchArticles();
      return;
    }
    // Q2 – GET /journalists/:id/articles: server-side filter
    axios.get(`http://localhost:5000/journalists/${selectedJournalistId}/articles`)
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  };

  const resetFilter = () => {
    setSelectedJournalistId('');
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
