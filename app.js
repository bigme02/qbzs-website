let currentCategory = 'all';
let currentSearchTerm = '';
let currentDateRange = 1;
let currentSummaryCategory = 'category1';
let currentDisplayedArticles = [];
let apiData = {
    category1: null,
    category2: null
};

async function callDataAPI(category, dateNum) {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: category,
                dateNum: dateNum
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API请求失败 (${response.status}):`, errorText);
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

async function callSearchAPI(key) {
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: key
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`搜索API请求失败 (${response.status}):`, errorText);
            throw new Error(`搜索API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('搜索API调用错误:', error);
        throw error;
    }
}

async function fetchAllData(dateNum) {
    try {
        console.log('=== 开始获取数据 ===');
        console.log('dateNum:', dateNum);

        const [category1Data, category2Data] = await Promise.all([
            callDataAPI('category1', dateNum),
            callDataAPI('category2', dateNum)
        ]);

        console.log('API调用完成');
        console.log('category1Data:', category1Data);
        console.log('category2Data:', category2Data);

        apiData.category1 = category1Data;
        apiData.category2 = category2Data;

        console.log('apiData已更新:', apiData);

        return { category1: category1Data, category2: category2Data };
    } catch (error) {
        console.error('获取数据失败:', error);
        throw error;
    }
}

function parseDataField(data) {
    if (!data) return null;
    
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('JSON解析失败:', e);
            return null;
        }
    }
    
    return data;
}

function extractContentAfterKeyword(text, keywords) {
    if (!text) return text;
    
    for (const keyword of keywords) {
        const index = text.indexOf(keyword);
        if (index !== -1) {
            const content = text.substring(index + keyword.length).trim();
            if (content) {
                return content;
            }
        }
    }
    
    return text;
}

function init() {
    loadTodaySummary();
    loadArticles();
    setupEventListeners();
}

function loadTodaySummary() {
    console.log('=== loadTodaySummary 被调用 ===');
    const summaryContainer = document.getElementById('todaySummary');
    
    console.log('apiData.category1:', apiData.category1);
    console.log('apiData.category2:', apiData.category2);
    console.log('currentSummaryCategory:', currentSummaryCategory);
    
    if (!apiData.category1 || !apiData.category2) {
        console.log('数据未准备好，显示加载中');
        summaryContainer.innerHTML = '<div class="loading">正在加载今日总结...</div>';
        return;
    }

    const category1Parsed = parseDataField(apiData.category1.data);
    const category2Parsed = parseDataField(apiData.category2.data);
    
    console.log('category1Parsed:', category1Parsed);
    console.log('category2Parsed:', category2Parsed);
    
    const category1Report = category1Parsed?.daily_report || '暂无总结';
    const category2Report = category2Parsed?.daily_report || '暂无总结';
    
    console.log('category1Report:', category1Report);
    console.log('category2Report:', category2Report);
    
    const currentReport = currentSummaryCategory === 'category1' ? category1Report : category2Report;
    const categoryName = currentSummaryCategory === 'category1' ? '燃油车' : '电动车';
    const markdown = marked.parse(currentReport);
    
    summaryContainer.innerHTML = `
        <div class="summary-content">
            <h3>
                <span class="category-badge ${currentSummaryCategory}">${categoryName}</span>
                今日${categoryName}文章总结
            </h3>
            <div class="markdown-content">${markdown}</div>
        </div>
    `;
    
    console.log('今日总结已渲染');
}

async function loadArticles() {
    console.log('=== loadArticles 被调用 ===');
    const articleList = document.getElementById('articleList');
    
    if (currentSearchTerm) {
        articleList.innerHTML = '<div class="loading">正在搜索...</div>';
        
        try {
            const searchData = await callSearchAPI(currentSearchTerm);
            const searchParsed = parseDataField(searchData.data);
            
            console.log('搜索结果:', searchParsed);
            
            if (searchParsed?.news_list && Array.isArray(searchParsed.news_list)) {
                const searchArticles = searchParsed.news_list.map(article => ({
                    ...article,
                    category: 'search',
                    categoryName: '搜索结果'
                }));
                
                renderArticles(searchArticles);
            } else {
                articleList.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
            }
        } catch (error) {
            console.error('搜索失败:', error);
            articleList.innerHTML = '<div class="no-results">搜索失败，请稍后重试</div>';
        }
        return;
    }
    
    if (!apiData.category1 || !apiData.category2) {
        articleList.innerHTML = '<div class="loading">正在加载文章列表...</div>';
        return;
    }

    let allArticles = [];

    const category1Parsed = parseDataField(apiData.category1.data);
    const category2Parsed = parseDataField(apiData.category2.data);

    console.log('category1Parsed.news_list:', category1Parsed?.news_list);
    console.log('category2Parsed.news_list:', category2Parsed?.news_list);

    if (category1Parsed?.news_list && Array.isArray(category1Parsed.news_list)) {
        category1Parsed.news_list.forEach(article => {
            allArticles.push({
                ...article,
                category: 'category1',
                categoryName: '燃油车'
            });
        });
    }

    if (category2Parsed?.news_list && Array.isArray(category2Parsed.news_list)) {
        category2Parsed.news_list.forEach(article => {
            allArticles.push({
                ...article,
                category: 'category2',
                categoryName: '电动车'
            });
        });
    }

    if (currentCategory !== 'all') {
        allArticles = allArticles.filter(article => article.category === currentCategory);
    }

    renderArticles(allArticles);
}

function renderArticles(allArticles) {
    const articleList = document.getElementById('articleList');
    
    currentDisplayedArticles = allArticles;
    
    console.log('allArticles.length:', allArticles.length);

    if (allArticles.length === 0) {
        articleList.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
        return;
    }

    articleList.innerHTML = allArticles.map((article, index) => {
        const summaryText = article.summary || '暂无摘要';
        const summaryMarkdown = marked.parse(summaryText);
        
        const lines = summaryText.split('\n');
        const isLong = lines.length > 5;
        
        return `
        <div class="article-card">
            ${article.picture ? `<img src="${article.picture}" alt="${article.title}" class="article-thumbnail" onerror="this.style.display='none'">` : ''}
            <div class="article-content">
                <div class="article-header">
                    <div>
                        <h3 class="article-title">
                            <a href="${article.link || '#'}" target="_blank" class="article-link">${article.title || '无标题'}</a>
                        </h3>
                        <div class="article-meta">
                            <span class="category-badge ${article.category}">${article.categoryName}</span>
                            ${article.author ? `<span class="author-badge">${article.author}</span>` : ''}
                            <span>${article.time || ''}</span>
                        </div>
                    </div>
                </div>
                <div class="article-summary-container">
                    <p class="article-summary collapsed" id="summary-${index}" style="display: none;"></p>
                    <button class="expand-btn" onclick="toggleSummary(${index})">展开全文</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    console.log('文章列表已渲染');
}

function toggleSummary(index) {
    const summaryElement = document.getElementById(`summary-${index}`);
    const buttonElement = summaryElement.nextElementSibling;
    
    if (summaryElement.classList.contains('collapsed')) {
        const article = getArticleByIndex(index);
        const summaryMarkdown = marked.parse(article.summary || '暂无摘要');
        summaryElement.innerHTML = summaryMarkdown;
        summaryElement.style.display = 'block';
        summaryElement.classList.remove('collapsed');
        buttonElement.textContent = '收起全文';
    } else {
        summaryElement.style.display = 'none';
        summaryElement.classList.add('collapsed');
        buttonElement.textContent = '展开全文';
    }
}

function getArticleByIndex(index) {
    return currentDisplayedArticles[index];
}

async function refreshData() {
    const dateNum = currentDateRange - 1;
    
    try {
        document.getElementById('todaySummary').innerHTML = '<div class="loading">正在加载今日总结...</div>';
        document.getElementById('articleList').innerHTML = '<div class="loading">正在加载文章列表...</div>';
        
        await fetchAllData(dateNum);
        
        loadTodaySummary();
        loadArticles();
    } catch (error) {
        console.error('刷新数据失败:', error);
        document.getElementById('todaySummary').innerHTML = '<div class="no-results">加载失败，请稍后重试</div>';
        document.getElementById('articleList').innerHTML = '<div class="no-results">加载失败，请稍后重试</div>';
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const dateRange = document.getElementById('dateRange');
    const tabButtons = document.querySelectorAll('.tab-btn');

    searchBtn.addEventListener('click', () => {
        currentSearchTerm = searchInput.value.trim();
        loadArticles();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = searchInput.value.trim();
            loadArticles();
        }
    });

    dateRange.addEventListener('change', async (e) => {
        currentDateRange = parseInt(e.target.value);
        await refreshData();
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            
            currentSummaryCategory = category;
            currentCategory = category;
            loadTodaySummary();
            loadArticles();
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await refreshData();
    setupEventListeners();
});
