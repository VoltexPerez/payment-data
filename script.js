document.getElementById("payment-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let cardType = document.getElementById("cardType").value;
    let cardholder = document.getElementById("cardholder").value;
    let cardNumber = document.getElementById("cardNumber").value;
    let expiryDate = document.getElementById("expiryDate").value;
    let cvv = document.getElementById("cvv").value;
    let amount = document.getElementById("amount").value;
    
    let paymentData = {
        cardType,
        cardholder,
        cardNumber: "**** **** **** " + cardNumber.slice(-4), // Masked for security
        expiryDate,
        cvv: "***", // Masked CVV for security
        amount,
        timestamp: new Date().toISOString()
    };

    let jsonData = JSON.stringify(paymentData, null, 2);

    // GitHub API details
    const githubUsername = "YOUR_GITHUB_USERNAME";
    const repoName = "YOUR_REPO_NAME";
    const filePath = "payments.json";
    const token = "YOUR_PERSONAL_ACCESS_TOKEN";  // Keep this private

    let existingData = [];
    let apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

    try {
        let response = await fetch(apiUrl, {
            headers: { Authorization: `token ${token}` }
        });

        if (response.ok) {
            let fileData = await response.json();
            existingData = JSON.parse(atob(fileData.content));
        }
    } catch (error) {
        console.log("No existing data or error fetching data.");
    }

    existingData.push(paymentData);

    let updateResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Updated payment records",
            content: btoa(JSON.stringify(existingData, null, 2)),
            sha: fileData?.sha
        })
    });

    if (updateResponse.ok) {
        document.getElementById("status").textContent = "Payment recorded successfully!";
    } else {
        document.getElementById("status").textContent = "Error saving payment.";
    }
});
