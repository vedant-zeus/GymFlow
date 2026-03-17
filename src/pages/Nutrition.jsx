import React, { useState, useEffect } from 'react';
import { Search, Calendar, Sunrise, Sun, Moon, Utensils, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import './Nutrition.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Nutrition = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal for quantity when a food is selected
  const [activeMealCategory, setActiveMealCategory] = useState(null); // 'Breakfast', 'Lunch', 'Dinner', 'Snacks'
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [isAddingFood, setIsAddingFood] = useState(false);

  // We will store the logged foods fetched from the DB here
  const [loggedFoods, setLoggedFoods] = useState([]);
  
  // Fetch specific user's food logs on load
  useEffect(() => {
    const fetchUserFoods = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Exit if not logged in
        
        const res = await axios.get(`${API_URL}/user-foods`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoggedFoods(res.data);
      } catch (err) {
        console.error('Error fetching user foods:', err);
        if (err.response) console.error('GET Response Error:', err.response.data);
      }
    };
    
    fetchUserFoods();
  }, []);

  // Handle Search Input
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await axios.get(`${API_URL}/food/search?query=${searchQuery}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error('Error searching food:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearchQuery('');
    setSearchResults([]);
  };

  const cancelAddFood = () => {
    setSelectedFood(null);
    setQuantity(100);
  };

  const closeCategoryModal = () => {
    setActiveMealCategory(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const confirmAddFood = async () => {
    if (!selectedFood || quantity <= 0) return;
    
    setIsAddingFood(true);
    try {
      // 1. Get accurate macros from USD API via our backend proxy
      const nutritionRes = await axios.post(`${API_URL}/food/nutrition`, {
        fdcId: selectedFood.fdcId,
        quantity: parseFloat(quantity)
      });
      
      const nutritionData = nutritionRes.data;
      
      const newFoodEntry = {
        fdcId: selectedFood.fdcId,
        title: nutritionData.description,
        portion: `${quantity}g`,
        category: activeMealCategory || 'Snacks',
        calories: Math.round(nutritionData.calories),
        protein: Math.round(nutritionData.protein),
        carbs: Math.round(nutritionData.carbs),
        fat: Math.round(nutritionData.fat)
      };

      // 2. Save this entry permanently to the User's Database
      const token = localStorage.getItem('token');
      if (token) {
        console.log("Attempting to POST to /user-foods with payload:", newFoodEntry);
        const dbRes = await axios.post(`${API_URL}/user-foods`, newFoodEntry, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Push to local state for immediate UI update, merging the newly created MySQL ID
        newFoodEntry.id = dbRes.data.id;
        setLoggedFoods([newFoodEntry, ...loggedFoods]);
      } else {
        alert('You must be logged in to save foods!');
      }

      cancelAddFood();
    } catch (err) {
      console.error('Full Error logging food:', err);
      if (err.response) {
        console.error('POST Error Response Data:', err.response.data);
        alert(`API Error: ${err.response.data.error || 'Failed to save'}`);
      } else {
        alert('Failed to calculate nutrition or save to database.');
      }
    } finally {
      setIsAddingFood(false);
    }
  };

  const removeFood = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${API_URL}/user-foods/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Remove locally only if the backend deleted it
        setLoggedFoods(loggedFoods.filter(food => food.id !== id));
      }
    } catch (err) {
      console.error('Error deleting food:', err);
      alert('Failed to delete food from database.');
    }
  };

  // Calculate Totals based on logged foods dynamically
  const totalCalories = loggedFoods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = loggedFoods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = loggedFoods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = loggedFoods.reduce((sum, food) => sum + food.fat, 0);
  
  const dailyTargetCalories = 2500;
  const progressPercent = Math.min(100, Math.round((totalCalories / dailyTargetCalories) * 100));

  return (
    <div className="nutrition-page">
      {/* Search and Category Meal Logging Modal */}
      {activeMealCategory && !selectedFood && (
          <div className="muscle-modal-overlay" onClick={closeCategoryModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }}>
            <div className="muscle-modal" onClick={(e) => e.stopPropagation()} style={{ background: '#0a0c0a', padding: '24px', borderRadius: '12px', border: '1px solid var(--accent-green)', minWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', color: '#fff' }}>Log {activeMealCategory}</h2>
                <button onClick={closeCategoryModal} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <div className="macro-search" style={{ position: 'relative', margin: 0 }}>
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search food to add..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', marginTop: '16px' }}>
                {isSearching ? <p style={{ color: 'var(--text-muted)' }}>Searching USDA Database...</p> : null}
                {searchResults.length > 0 && !isSearching ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchResults.map(food => (
                      <div 
                        key={food.fdcId} 
                        onClick={() => handleSelectFood(food)}
                        style={{ padding: '12px', background: '#121813', border: '1px solid transparent', color: '#fff', cursor: 'pointer', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px' }}
                      >
                        <span style={{flex: 1, paddingRight: '12px'}}>{food.description}</span>
                        <Plus size={16} color="var(--accent-green)" />
                      </div>
                    ))}
                  </div>
                ) : null}
                {!isSearching && searchResults.length === 0 && searchQuery.length > 2 && (
                  <p style={{ color: 'var(--text-muted)' }}>No foods found.</p>
                )}
              </div>
            </div>
          </div>
      )}

      {/* Search Quantity Modal */}
      {selectedFood && (
          <div className="muscle-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="muscle-modal" style={{ background: '#0a0c0a', padding: '24px', borderRadius: '12px', border: '1px solid var(--accent-green)', minWidth: '350px' }}>
              <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Add {selectedFood.description}</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '12px' }}>Quantity (grams)</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#121813', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={cancelAddFood} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={confirmAddFood} disabled={isAddingFood} style={{ flex: 1, padding: '12px', background: 'var(--accent-green)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isAddingFood ? 'Calculating...' : 'Add Food'}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Top Metrics Section */}
      <div className="metrics-grid">
        {/* Ring Chart Card */}
        <div className="card calorie-card">
          <div className="ring-container">
            <svg viewBox="0 0 160 160" className="calorie-ring">
              <circle cx="80" cy="80" r="70" className="ring-bg" />
              <circle cx="80" cy="80" r="70" className="ring-progress" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * (progressPercent / 100))} />
            </svg>
            <div className="ring-content">
              <span className="calorie-value">{totalCalories.toLocaleString()}</span>
              <span className="calorie-target">OF 2,500 KCAL</span>
            </div>
          </div>
          <div className="calorie-footer">
            <span className="footer-label">Daily Goal Progress</span>
            <span className="footer-progress">{progressPercent}% Completed</span>
          </div>
        </div>

        {/* Macros & Small Stats */}
        <div className="macros-container">
          <div className="card macros-card" style={{ position: 'relative', overflow: 'visible' }}>
            <div className="macro-bars" style={{ marginTop: '12px' }}>
              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">PROTEIN</span>
                  <span className="macro-values">
                    <span className="macro-current">{totalProtein}G</span> / 180G
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (totalProtein/180)*100)}%` }}></div>
                </div>
              </div>
              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">CARBS</span>
                  <span className="macro-values">
                    <span className="macro-current">{totalCarbs}G</span> / 250G
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (totalCarbs/250)*100)}%` }}></div>
                </div>
              </div>
              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">FATS</span>
                  <span className="macro-values">
                    <span className="macro-current">{totalFat}G</span> / 70G
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (totalFat/70)*100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="small-stats-grid">
            <div className="card stat-card">
              <div className="stat-value">2.4L</div>
              <div className="stat-label">WATER</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">14g</div>
              <div className="stat-label">FIBER</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">2,100</div>
              <div className="stat-label">SODIUM (MG)</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">42g</div>
              <div className="stat-label">SUGAR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Log Section */}
      <div className="section-header">
        <h2 className="section-title">MEAL LOG</h2>
        <div className="date-picker">
          <Calendar size={16} />
          <span>Today, Oct 24</span>
        </div>
      </div>

      <div className="meal-log-grid">
        <div className="card meal-card" style={{ cursor: 'pointer' }} onClick={() => setActiveMealCategory('Breakfast')}>
          <div className="meal-card-header">
            <div className="meal-icon-wrapper"><Sunrise size={20} /></div>
            <span className="meal-time">Add Meal +</span>
          </div>
          <h3 className="meal-name">Breakfast</h3>
          <p className="meal-kcal">{loggedFoods.filter(f => f.category === 'Breakfast').reduce((sum, f) => sum + f.calories, 0)} kcal</p>
          <div className="meal-items">
            <div className="food-icon">🍳</div>
            <div className="food-icon">🥛</div>
          </div>
        </div>

        <div className="card meal-card" style={{ cursor: 'pointer' }} onClick={() => setActiveMealCategory('Lunch')}>
          <div className="meal-card-header">
            <div className="meal-icon-wrapper"><Sun size={20} /></div>
            <span className="meal-time">Add Meal +</span>
          </div>
          <h3 className="meal-name">Lunch</h3>
          <p className="meal-kcal">{loggedFoods.filter(f => f.category === 'Lunch').reduce((sum, f) => sum + f.calories, 0)} kcal</p>
          <div className="meal-items">
            <div className="food-icon">🥗</div>
          </div>
        </div>

        <div className="card meal-card active-meal" style={{ cursor: 'pointer' }} onClick={() => setActiveMealCategory('Dinner')}>
          <div className="meal-card-header">
            <div className="meal-icon-wrapper active"><Moon size={20} /></div>
            <span className="meal-time">Add Meal +</span>
          </div>
          <h3 className="meal-name">Dinner</h3>
          <p className="meal-target">Goal: 750 kcal | Current: {loggedFoods.filter(f => f.category === 'Dinner').reduce((sum, f) => sum + f.calories, 0)} kcal</p>
          <button className="log-btn">LOG MEAL</button>
          <Utensils className="bg-icon" size={100} />
        </div>

        <div className="card meal-card" style={{ cursor: 'pointer' }} onClick={() => setActiveMealCategory('Snacks')}>
          <div className="meal-card-header">
            <div className="meal-icon-wrapper"><Utensils size={20} /></div>
            <span className="meal-time">Add Meal +</span>
          </div>
          <h3 className="meal-name">Snacks</h3>
          <p className="meal-kcal">{loggedFoods.filter(f => f.category === 'Snacks').reduce((sum, f) => sum + f.calories, 0)} kcal</p>
          <div className="meal-items">
            <div className="food-icon">🍎</div>
          </div>
        </div>
      </div>

      {/* What I Ate Section */}
      <div className="section-header">
        <h2 className="section-title">WHAT I ATE</h2>
      </div>

      <div className="food-list">
        {loggedFoods.map((food) => (
          <div className="card food-list-item" key={food.id}>
            <div className="food-left">
              <div className="food-image">🥑</div>
              <div className="food-details">
                <h4 className="food-title">{food.title}</h4>
                <p className="food-portion">{food.portion} • {food.category}</p>
              </div>
            </div>
            <div className="food-right">
              <div className="food-macros">
                <div className="food-macro">
                  <span className="label">P</span>
                  <span className="value protein">{food.protein}g</span>
                </div>
                <div className="food-macro">
                  <span className="label">C</span>
                  <span className="value">{food.carbs}g</span>
                </div>
                <div className="food-macro">
                  <span className="label">F</span>
                  <span className="value">{food.fat}g</span>
                </div>
              </div>
              <div className="food-calories">
                <span className="kcal-val">{food.calories}</span>
                <span className="kcal-lbl">KCAL</span>
              </div>
              <button className="delete-btn" onClick={() => removeFood(food.id)}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nutrition;
