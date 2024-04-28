import { useState, useRef, useEffect } from 'react';

function OtpLogin() {
    const [phoneNumber, setPhoneNumber] = useState(''); // State to hold phone number
    const [otp, setOtp] = useState(new Array(4).fill('')); // State to hold entered OTP
    const inputs = useRef([]); // Ref to store input element references
    const phoneNumberRef = useRef(null); // Ref to store phone number input element reference]
    const [showOtpField, setShowOtpField] = useState(false); // State to toggle OTP field visibility

    // Focus input field on initial render
    useEffect(() => {
        // Focus the first input field on initial render
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }

        // Focus the phone number input field when it becomes visible
        if (!showOtpField) {
            phoneNumberRef.current.focus();
        }
    }, [showOtpField]);


    // Function to handle input change in an OTP field
    const handleInputChange = (event, index) => {
        const value = event.target.value
        if (isNaN(value)) {
            return;
        }
        const newOtp = [...otp]

        // take only one digit from the input
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp)

        const combinedOtp = newOtp.join('')

        if (combinedOtp.length === 4) {
            // Implement your OTP verification logic here (e.g., API call)
            handleOtpSubmit(combinedOtp);
        }

        // Focus the next input field if a valid digit is entered
        if (value && index < 3 && inputs.current[index + 1]) {
            inputs.current[index + 1].focus();
        }
    };

    // Function to handle click event in an OTP field
    const handelClick = (index) => {
        if (inputs.current[index]) {
            inputs.current[index].setSelectionRange(1, 1);
        }
    };
    // Function to handle key down event in an OTP field
    const handelKeyDown = (event, index) => {
        if (event.key === 'Backspace' && !otp[index]  && inputs.current[index - 1]) {
            inputs.current[index - 1].focus();
        }
    };

    // Function to handle paste event in an OTP field
    const handelPaste = (event, index) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        if (isNaN(paste)) {
            return;
        }
        const newOtp = [...otp]
        for (let i = 0; i < paste.length; i++) {
            if (index + i < 4) {
                newOtp[index + i] = paste[i];
            }
        }
        setOtp(newOtp);

        const combinedOtp = newOtp.join('')

        if (combinedOtp.length === 4) {
            // Implement your OTP verification logic here (e.g., API call)
            handleOtpSubmit(combinedOtp);
        }

        // Focus the next input field if a valid digit is entered
        if (index + paste.length < 4 && inputs.current[index + paste.length]) {
            inputs.current[index + paste.length].focus();
        }
    };

    // Function to handle form submission (replace with your actual OTP verification logic)
    const handleOtpSubmit = (otp) => {
        console.log('Entered OTP:', otp);
    };

    // Function to handle phone number submission
    const handlePhoneSubmit = (event) => {
        event.preventDefault();
        // Rejex to validate phone number
        const phoneRejex = /^[0-9]{10}$/;
        if (!phoneRejex.test(phoneNumber)) {
            alert('Please enter a valid phone number');
            return;
        }
        setShowOtpField(true);
        // Implement your OTP request logic here (e.g., API call)
    };

    return (
        (showOtpField) ? (
            <div>
                <h1 className='title'>Enter OTP sent to your phone number:</h1>
                <div className="otp-container">
                    {Array(4) // Generate 4 input fields for 4-digit OTP
                        .fill(0)
                        .map((_, index) => (
                            <input
                                key={index}
                                type="tel" // Set input type to "tel" for better mobile experience
                                value={otp[index] || ''} // Set initial value from OTP state
                                onChange={(e) => handleInputChange(e, index)}
                                onClick={() => handelClick(index)}
                                onKeyDown={(e) => { handelKeyDown(e, index) }}
                                onPaste={(e) => {handelPaste(e, index)}} 
                                ref={(el) => (inputs.current[index] = el)} // Store reference
                            />
                        ))}
                </div>
            </div>
        ) : (
            // Enter phone number form
            <form onSubmit={handlePhoneSubmit}>
                <h1 className='title'>Enter your phone number:</h1>
                <input
                    className='phone-input'
                    type="tel" // Set input type to "tel" for better mobile experience
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10} // Limit input to 10 characters
                    ref={phoneNumberRef} // Store reference to phone number input element
                />
                <button type="submit" disabled={phoneNumber.length !== 10}>
                    Send OTP
                </button>
            </form>
        )
    );
}

export default OtpLogin;
