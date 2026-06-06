// auth.js
// Client-side authentication logic without a server database.

const $ = id => document.getElementById(id);

// Function to convert string to ArrayBuffer for Web Crypto API
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// Function to convert ArrayBuffer to Hex String
function ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        }
    );
    return hexArr.join('');
}

// Hash the passphrase using SHA-256
async function hashPasskey(key) {
    const data = new TextEncoder().encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return ab2hex(hashBuffer);
}

// Feedback helpers
function authClearFeedback() {
    $('auth-error').style.display = 'none';
    $('auth-notice').style.display = 'none';
}

function authShowError(msg) {
    $('auth-error').textContent = msg;
    $('auth-error').style.display = 'block';
}

function setLoading(btnId, on) {
    const btn = $(btnId);
    btn.disabled = on;
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.innerHTML = on ? '<span class="auth-spinner"></span>' : btn.dataset.label;
}

window.authDoSignIn = async () => {
    authClearFeedback();
    const passkey = $('si-pw').value.trim();
    
    if (!passkey) {
        authShowError('Please enter your Access Key.');
        return;
    }

    setLoading('btn-signin', true);

    try {
        const hashedKey = await hashPasskey(passkey);
        
        // VALID_HASHES is loaded from js/data/hashes.js
        if (window.VALID_HASHES && window.VALID_HASHES.includes(hashedKey)) {
            // Authentication successful!
            sessionStorage.setItem('archive_access_granted', 'true');
            
            // Show success view
            ['auth-view-signin'].forEach(id => { 
                if($(id)) $(id).style.display = 'none'; 
            });
            $('auth-view-success').style.display = 'block';
            
            // In a real scenario, you might redirect here:
            // window.location.href = 'archive.html';
        } else {
            authShowError('Invalid Access Key. Please check with the administrator.');
        }
    } catch (e) {
        authShowError('An error occurred during verification.');
        console.error(e);
    } finally {
        setLoading('btn-signin', false);
    }
};

window.authDoSignOut = () => {
    sessionStorage.removeItem('archive_access_granted');
    $('si-pw').value = '';
    $('auth-view-success').style.display = 'none';
    $('auth-view-signin').style.display = 'block';
};

window.authTogglePw = (inputId, btnId) => {
    const input = $(inputId);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    $(btnId).textContent = show ? 'Hide' : 'Show';
};

// Enter key submits active view
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const modal = $('portal-modal');
    if (modal && modal.classList.contains('open')) {
        if ($('auth-view-signin') && $('auth-view-signin').style.display !== 'none') {
            authDoSignIn();
        }
    }
});

// Modal Logic
window.openModal = () => {
    $('portal-modal').classList.add('open');
    // If they already have access, skip straight to success
    if (sessionStorage.getItem('archive_access_granted') === 'true') {
        $('auth-view-signin').style.display = 'none';
        $('auth-view-success').style.display = 'block';
    } else {
        $('auth-view-signin').style.display = 'block';
        $('auth-view-success').style.display = 'none';
    }
};

window.closeModal = () => {
    $('portal-modal').classList.remove('open');
};

window.openOrGate = (dest) => {
    if (sessionStorage.getItem('archive_access_granted') === 'true') {
        // They have access
        if (dest === 'gallery') {
            // openGallery(); // Assuming openGallery is implemented elsewhere
            alert('Access Granted! In the full app, this will open the Photo Gallery.');
        }
    } else {
        openModal();
    }
};
