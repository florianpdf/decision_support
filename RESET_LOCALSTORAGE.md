# How to Reset localStorage

To completely reset the application's localStorage and start fresh, follow these steps:

## Method 1: Using Browser Developer Tools (Recommended)

1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - **Safari**: Press `Cmd+Option+I` (Mac)

2. Go to the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)

3. In the left sidebar, expand **Local Storage**

4. Click on your site's URL (e.g., `http://localhost:3001` or `https://florianpdf.github.io/decision_support`)

5. You will see all the localStorage keys. Delete the following keys:
   - `bulle_chart_professions`
   - `bulle_chart_categories`
   - `bulle_chart_criteria`
   - `bulle_chart_criterion_weights`
   - `bulle_chart_next_profession_id`
   - `bulle_chart_next_category_id`
   - `bulle_chart_next_criterion_id`

6. **OR** right-click on your site's URL and select **Clear** to delete all localStorage data for this site

7. Refresh the page (`F5` or `Ctrl+R`)

## Method 2: Using Browser Console

1. Open your browser's Developer Tools (see Method 1)

2. Go to the **Console** tab

3. Copy and paste the following command, then press Enter:

```javascript
localStorage.clear();
location.reload();
```

This will clear all localStorage data and reload the page.

## Method 3: Clear All Site Data (Most Thorough)

1. Open your browser's Developer Tools

2. Go to the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)

3. Click on **Clear site data** or **Clear storage**

4. Check all boxes (Cookies, Local Storage, Session Storage, etc.)

5. Click **Clear site data**

6. Refresh the page

## Method 4: Using Browser Settings

### Chrome/Edge:
1. Click the three dots menu → **Settings**
2. Go to **Privacy and security** → **Site settings**
3. Click **View permissions and data stored across sites**
4. Search for your site
5. Click on it and select **Delete**

### Firefox:
1. Click the three lines menu → **Settings**
2. Go to **Privacy & Security**
3. Under **Cookies and Site Data**, click **Clear Data**
4. Select **Cookies and Site Data** and **Cached Web Content**
5. Click **Clear**

## Verification

After clearing localStorage, when you reload the application:
- You should see the "Create your first profession" screen
- No professions, categories, or criteria should be displayed
- The application should be in its initial state

## Note

⚠️ **Warning**: Clearing localStorage will permanently delete all your data. Make sure you have exported any important data before clearing if needed.
