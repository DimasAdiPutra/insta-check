// ========================================
// 1. APPLICATION STATE
// ========================================

const state = {
	followers: [],
	following: [],
	notFollowingBack: [],
	notFollowedBack: [],
	zipFileName: null,
}

// ========================================
// 2. DOM ELEMENTS
// ========================================

const elements = {
	// Pages
	importPage: document.getElementById('import-page'),
	resultsPage: document.getElementById('results-page'),

	// Upload
	uploadArea: document.getElementById('upload-area'),
	fileInput: document.getElementById('zip-file'),
	browseBtn: document.getElementById('browse-btn'),

	// Dashboard
	resetBtn: document.getElementById('reset-btn'),
	followersCount: document.getElementById('followers-count'),
	followingCount: document.getElementById('following-count'),
	notFollowingBackCount: document.getElementById('not-following-back-count'),
	notFollowedBackCount: document.getElementById('not-followed-back-count'),

	// Tabs
	tabs: document.querySelectorAll('.tab'),
	tabContents: document.querySelectorAll('.tab-content'),

	// Search
	searchInput: document.getElementById('search-input'),

	// Overlays
	loadingOverlay: document.getElementById('loading-overlay'),
	loadingSpinner: document.querySelector('.loading-spinner'),
	loadingText: document.querySelector('.loading-content h3'),
	loadingSubtext: document.querySelector('.loading-content p'),

	errorOverlay: document.getElementById('error-overlay'),
	errorTitle: document.getElementById('error-title'),
	errorMessage: document.getElementById('error-message'),
	closeErrorBtn: document.getElementById('close-error-btn'),
}

// ========================================
// 3. NAVIGATION & UI
// ========================================

function switchPage(pageName) {
	elements.importPage.classList.remove('active')
	elements.resultsPage.classList.remove('active')

	if (pageName === 'import') {
		elements.importPage.classList.add('active')
	} else if (pageName === 'results') {
		elements.resultsPage.classList.add('active')
	}
}

function showLoading(
	text = 'Memproses file ZIP...',
	subtext = 'Mohon tunggu, data sedang diproses secara lokal di browser Anda',
) {
	elements.loadingText.textContent = text
	elements.loadingSubtext.textContent = subtext
	elements.loadingOverlay.classList.add('active')
}

function hideLoading() {
	elements.loadingOverlay.classList.remove('active')
}

function showError(title, message) {
	elements.errorTitle.textContent = title
	elements.errorMessage.textContent = message
	elements.errorOverlay.classList.add('active')
}

function hideError() {
	elements.errorOverlay.classList.remove('active')
}

function renderUserList(container, usernames, searchTerm = '') {
	// Clear existing list except empty state
	const existingList = container.querySelector('.user-list')
	if (existingList) {
		existingList.remove()
	}

	// Filter based on search term
	const filteredUsernames = usernames.filter((username) =>
		username.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// Show empty state if no results
	if (filteredUsernames.length === 0) {
		const emptyState = container.querySelector('.empty-state')
		if (emptyState) {
			emptyState.style.display = 'block'
		}
		return
	}

	// Hide empty state
	const emptyState = container.querySelector('.empty-state')
	if (emptyState) {
		emptyState.style.display = 'none'
	}

	// Create user list container
	const userList = document.createElement('div')
	userList.className = 'user-list'

	// Add usernames
	filteredUsernames.forEach((username) => {
		const userItem = document.createElement('div')
		userItem.className = 'user-item'
		userItem.textContent = username

		userList.appendChild(userItem)
	})

	container.appendChild(userList)
}

function resetDashboard() {
	state.followers = []
	state.following = []
	state.notFollowingBack = []
	state.notFollowedBack = []
	state.zipFileName = null

	elements.followersCount.textContent = '0'
	elements.followingCount.textContent = '0'
	elements.notFollowingBackCount.textContent = '0'
	elements.notFollowedBackCount.textContent = '0'

	switchPage('import')

	clearSearch()
	resetTabs()

	// Clear all user lists
	const tabs = ['followers', 'following', 'not-following-back', 'not-followed-back']
	tabs.forEach((tabName) => {
		const content = document.getElementById(`${tabName}-content`)
		const existingList = content.querySelector('.user-list')
		if (existingList) {
			existingList.remove()
		}
		const emptyState = content.querySelector('.empty-state')
		if (emptyState) {
			emptyState.style.display = 'block'
		}
	})
}

// ========================================
// 4. TAB MANAGEMENT
// ========================================

function setActiveTab(tabName) {
	elements.tabs.forEach((tab) => {
		tab.classList.remove('active')
		if (tab.dataset.tab === tabName) {
			tab.classList.add('active')
		}
	})

	elements.tabContents.forEach((content) => {
		content.classList.remove('active')
		if (content.id === `${tabName}-content`) {
			content.classList.add('active')
		}
	})
}

function resetTabs() {
	setActiveTab('followers')
}

function clearSearch() {
	elements.searchInput.value = ''
}

// ========================================
// 5. EVENT LISTENERS
// ========================================

// File input change
elements.fileInput.addEventListener('change', (e) => {
	const file = e.target.files[0]
	if (file) {
		handleFileSelect(file)
	}
})

// Browse button click
elements.browseBtn.addEventListener('click', () => {
	elements.fileInput.click()
})

// Drag & drop
elements.uploadArea.addEventListener('dragover', (e) => {
	e.preventDefault()
	elements.uploadArea.style.borderColor = 'var(--color-emerald-400)'
	elements.uploadArea.style.backgroundColor = 'var(--color-emerald-100)'
})

elements.uploadArea.addEventListener('dragleave', () => {
	elements.uploadArea.style.borderColor = 'var(--color-emerald-200)'
	elements.uploadArea.style.backgroundColor = 'var(--color-emerald-50)'
})

elements.uploadArea.addEventListener('drop', (e) => {
	e.preventDefault()
	elements.uploadArea.style.borderColor = 'var(--color-emerald-200)'
	elements.uploadArea.style.backgroundColor = 'var(--color-emerald-50)'

	const file = e.dataTransfer.files[0]
	if (file) {
		// Check file type or extension
		const isZipFile = file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
		if (isZipFile) {
			handleFileSelect(file)
		} else {
			showError(
				'Format File Tidak Valid',
				'File yang Anda pilih bukan ZIP. Silakan pilih file ekspor Instagram dalam format ZIP.',
			)
		}
	}
})

// Tab switching
elements.tabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		const tabName = tab.dataset.tab
		setActiveTab(tabName)
	})
})

// Search input
elements.searchInput.addEventListener('input', (e) => {
	const searchTerm = e.target.value.trim().toLowerCase()
	handleSearch(searchTerm)
})

// Reset button
elements.resetBtn.addEventListener('click', () => {
	resetDashboard()
})

// Close error overlay
elements.closeErrorBtn.addEventListener('click', () => {
	hideError()
})

// Click outside error overlay to close
elements.errorOverlay.addEventListener('click', (e) => {
	if (e.target === elements.errorOverlay) {
		hideError()
	}
})

// ========================================
// 6. HELPER FUNCTIONS
// ========================================

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function isValidZip(file) {
	if (!file.name.toLowerCase().endsWith('.zip')) {
		return false
	}

	if (file.size > MAX_FILE_SIZE) {
		return false
	}

	return true
}

function normalizeUsername(value, href) {
	if (!value || typeof value !== 'string') {
		// Fallback to href if value is missing
		if (href && typeof href === 'string') {
			value = href
		} else {
			return null
		}
	}

	// Extract username from Instagram URL if needed
	let username = value.trim()

	// Remove leading @ if present
	if (username.startsWith('@')) {
		username = username.slice(1)
	}

	// Extract username from URL
	const instagramUrlRegex = /instagram\.com\/([^/?]+)/
	const match = username.match(instagramUrlRegex)
	if (match) {
		username = match[1]
	}

	// Remove trailing slash
	username = username.replace(/\/$/, '')

	// Convert to lowercase and remove whitespace
	username = username.toLowerCase().trim()

	// Return null if empty
	if (username === '') {
		return null
	}

	return username
}

// ========================================
// 6.1 JSON STRUCTURE RECOGNITION
// ========================================

function isFollowersStructure(data) {
	// Structure 1: Array of objects with string_list_data
	if (Array.isArray(data)) {
		return data.every(
			(item) =>
				item &&
				typeof item === 'object' &&
				item.string_list_data &&
				Array.isArray(item.string_list_data),
		)
	}
	return false
}

function isFollowingStructure(data) {
	// Structure 2: Object with relationships_following array
	if (
		!data ||
		typeof data !== 'object' ||
		!data.relationships_following ||
		!Array.isArray(data.relationships_following)
	) {
		return false
	}

	// Each item must have string_list_data array
	return data.relationships_following.every(
		(item) =>
			item &&
			typeof item === 'object' &&
			item.string_list_data &&
			Array.isArray(item.string_list_data)
	)
}

// ========================================
// 6.2 FILE DISCOVERY
// ========================================

function suggestsFollowers(fileName) {
	// Extract base filename (remove path)
	const baseName = fileName.split('/').pop().toLowerCase()
	const hasFollowers = baseName.includes('followers')
	const hasFollowing = baseName.includes('following') && !baseName.includes('followers')
	const isExcluded = baseName.includes('close') || baseName.includes('pending') || baseName.includes('unfollowed') || baseName.includes('mutual')

	return hasFollowers && !hasFollowing && !isExcluded
}

function suggestsFollowing(fileName) {
	// Extract base filename (remove path)
	const baseName = fileName.split('/').pop().toLowerCase()
	const hasFollowing = baseName.includes('following')
	const hasFollowers = baseName.includes('followers') && !baseName.includes('following')
	const isExcluded = baseName.includes('close') || baseName.includes('pending') || baseName.includes('unfollowed') || baseName.includes('mutual')

	return hasFollowing && !hasFollowers && !isExcluded
}

async function discoverAndParseJsonFiles(zip) {
	const candidates = {
		followers: [],
		following: [],
	}

	const entries = await zip.files

	// First pass: identify candidate files based on name
	for (const path in entries) {
		const entry = entries[path]

		if (entry.dir) {
			continue
		}

		const fileName = entry.name

		if (fileName.endsWith('.json')) {
			if (suggestsFollowers(fileName)) {
				candidates.followers.push(entry)
			} else if (suggestsFollowing(fileName)) {
				candidates.following.push(entry)
			}
		}
	}

	// Second pass: validate structure and extract usernames
	const followers = []
	const following = []

	for (const entry of candidates.followers) {
		try {
			const content = await entry.async('string')
			const data = JSON.parse(content)

			if (isFollowersStructure(data)) {
				const usernames = extractUsernamesFromData(data)
				followers.push(...usernames)
			} else {
				throw new Error(
					`File ${entry.name} tidak memiliki struktur Followers yang dikenali.`,
				)
			}
		} catch (error) {
			throw new Error(`Gagal membaca atau memvalidasi ${entry.name}: ${error.message}`)
		}
	}

	for (const entry of candidates.following) {
		try {
			const content = await entry.async('string')
			const data = JSON.parse(content)

			if (isFollowingStructure(data)) {
				const usernames = extractUsernamesFromData(data)
				following.push(...usernames)
			} else {
				throw new Error(
					`File ${entry.name} tidak memiliki struktur Following yang dikenali.`,
				)
			}
		} catch (error) {
			throw new Error(`Gagal membaca atau memvalidasi ${entry.name}: ${error.message}`)
		}
	}

	return { followers, following }
}

function extractUsernamesFromData(data) {
	const usernames = new Set()

	// Handle array format (Followers)
	if (Array.isArray(data)) {
		data.forEach((item) => {
			if (item && item.string_list_data && Array.isArray(item.string_list_data)) {
				item.string_list_data.forEach((entry) => {
					if (entry) {
						// For followers, username is in 'value' field
						const username = normalizeUsername(entry.value, entry.href)
						if (username) {
							usernames.add(username)
						}
					}
				})
			}
		})
	}
	// Handle object format with relationships_following (Following)
	else if (data && data.relationships_following && Array.isArray(data.relationships_following)) {
		data.relationships_following.forEach((item) => {
			// For following, username is in 'title' field
			if (item && item.title) {
				const username = normalizeUsername(item.title)
				if (username) {
					usernames.add(username)
				}
			}
		})
	}

	return Array.from(usernames)
}

async function findAndParseJsonFiles(zip) {
	return await discoverAndParseJsonFiles(zip)
}

async function processZipFile(file) {
	showLoading('Membaca file ZIP...', 'Mengambil data Followers dan Following')

	try {
		// Validate file
		if (!isValidZip(file)) {
			throw new Error(
				'File yang Anda pilih bukan ZIP atau terlalu besar. Maksimal ukuran file adalah 10 MB.',
			)
		}

		// Read ZIP using JSZip
		const zip = new JSZip()

		const zipContent = await zip.loadAsync(file)

		// Find and parse JSON files
		const { followers, following } = await findAndParseJsonFiles(zipContent)

		// Validate that we found the required files
		if (followers.length === 0 && following.length === 0) {
			throw new Error(
				'Tidak ditemukan file Followers atau Following dalam ZIP. Pastikan Anda memilih kategori "Followers and following" saat mengunduh data.',
			)
		}

		// Validate that we found at least one followers file
		if (followers.length === 0) {
			throw new Error(
				'Tidak ditemukan file Followers dalam ZIP. Pastikan Anda memilih kategori "Followers and following" saat mengunduh data.',
			)
		}

		// Validate that we found at least one following file
		if (following.length === 0) {
			throw new Error(
				'Tidak ditemukan file Following dalam ZIP. Pastikan Anda memilih kategori "Followers and following" saat mengunduh data.',
			)
		}

		// Update state
		state.followers = followers
		state.following = following
		state.zipFileName = file.name

		// Calculate differences using Set for efficiency
		// Use normalized usernames for comparison, but preserve original case for display
		const followingSet = new Set(following.map((u) => u.toLowerCase()))
		const followersSet = new Set(followers.map((u) => u.toLowerCase()))

		state.notFollowingBack = followers.filter(
			(username) => !followingSet.has(username.toLowerCase()),
		)
		state.notFollowedBack = following.filter(
			(username) => !followersSet.has(username.toLowerCase()),
		)

		// Update UI
		elements.followersCount.textContent = state.followers.length
		elements.followingCount.textContent = state.following.length
		elements.notFollowingBackCount.textContent = state.notFollowingBack.length
		elements.notFollowedBackCount.textContent = state.notFollowedBack.length

		// Render user lists for all tabs
		updateEmptyStates()

		hideLoading()
		switchPage('results')

		// Show success message (optional, could add a toast or notification)
		console.log('Successfully processed ZIP file:', file.name)
	} catch (error) {
		hideLoading()
		showError('Gagal Memproses File', error.message)
	}
}

async function handleFileSelect(file) {
	await processZipFile(file)
}

function updateEmptyStates() {
	// Update empty states for each tab based on current data
	const tabs = ['followers', 'following', 'not-following-back', 'not-followed-back']
	tabs.forEach((tabName) => {
		const content = document.getElementById(`${tabName}-content`)
		const searchTerm = elements.searchInput.value.trim().toLowerCase()
		let usernames = []

		switch (tabName) {
			case 'followers':
				usernames = state.followers
				break
			case 'following':
				usernames = state.following
				break
			case 'not-following-back':
				usernames = state.notFollowingBack
				break
			case 'not-followed-back':
				usernames = state.notFollowedBack
				break
		}

		renderUserList(content, usernames, searchTerm)
	})
}

function handleSearch(searchTerm) {
	// Update all tab contents with filtered results
	const tabs = ['followers', 'following', 'not-following-back', 'not-followed-back']
	tabs.forEach((tabName) => {
		const content = document.getElementById(`${tabName}-content`)
		let usernames = []

		switch (tabName) {
			case 'followers':
				usernames = state.followers
				break
			case 'following':
				usernames = state.following
				break
			case 'not-following-back':
				usernames = state.notFollowingBack
				break
			case 'not-followed-back':
				usernames = state.notFollowedBack
				break
		}

		renderUserList(content, usernames, searchTerm)
	})
}

// ========================================
// 7. INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
	console.log('Insta-Check initialized')
	console.log('State:', state)
})
