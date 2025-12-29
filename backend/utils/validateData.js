export const validateName = (name) => {
    if (!name || name === '' || name.length < 2) {
        throw new Error('Name error');
    }
}


export const validateDob = (dob) => {
    if (!dob || dob === '') {
        throw new Error('Age error');
    }
    
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date of birth");
    }

    const today = new Date();

    if (birthDate >= today) {
        throw ("Date of birth must be in the past");
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 0) {
        throw ("User must be at least 13 years old");
    }

    if (age > 100) {
        throw new Error("Invalid date of birth");
    }

    return true;
}



export const validateEmail = (email) => {
    if (!email || email === '') {
        throw new Error('Email error');
    }
    
    const regex = /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
    
    if (!regex.test(email)) {
        throw new Error('Email error');
    }
}



export const validatePassword = (password) => {
    if (!password || password === '') {
        throw new Error('Password error');
    }
    
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
    if (!regex.test(password)) {
        throw new Error('Password error');
    }
}



export const validateGender = (gender) => {
    if (!gender || gender === '') {
        throw new Error('Gender error');
    }
    
    const allowedGenders = ["male", "female"];
    
    if (!allowedGenders.includes(gender.toLowerCase())) {
        throw new Error('Gender error');
    }
}



export const validatePhone = (phone) => {
    if (!phone || phone === '') {
        throw new Error('Phone error');
    }
    
    const regex = /^(\+2)?01[0125][0-9]{8}$/;
    if (!regex.test(phone)) {
        throw new Error('Phone error');
    }
}


export const validateImageUrl = (image_url) => {
    if (!image_url || typeof image_url !== 'string') {
        throw new Error('Invalid image URL');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    const isValid = allowedExtensions.some(ext =>
        image_url.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
        throw new Error("Image URL is not valid");
    }

    return true;
};

export const validateUserData = (userData) => {
    try {
        validateDob(userData.dob);
        validateName(userData.name);
        validateEmail(userData.email);
        validatePassword(userData.password);
        validateGender(userData.gender);
        
        if (userData.phone) {
            validatePhone(userData.phone);
        }
        
        if (userData.image_url) {
            validateImageUrl(userData.image_url);
        }
    } catch (err) {
        throw new Error(err)
    }
}
