// ===============================
// SUPABASE CONNECTION
// ===============================

const SUPABASE_URL =
    "https://whhzyvecyxctjvtbgqph.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_wAhYXZ6U-Yu1HRPfa7bHSA_-DmkLjPV";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ===============================
// LOGIN
// ===============================

function loginFarmer() {

    document.getElementById("loginSection").style.display = "none";

    document.getElementById("farmerDashboard").style.display = "block";
}


function loginBuyer() {

    document.getElementById("loginSection").style.display = "none";

    document.getElementById("buyerDashboard").style.display = "block";
}


// ===============================
// PUBLISH PRODUCE
// ===============================

async function publishProduce() {

    const crop =
        document.getElementById("crop").value.trim();

    const quantity =
        document.getElementById("quantity").value;

    const price =
        document.getElementById("price").value;

    const location =
        document.getElementById("location").value.trim();


    if (!crop || !quantity || !price || !location) {

        document.getElementById("listing").innerHTML =
            "⚠️ Please fill all details.";

        return;
    }


    document.getElementById("listing").innerHTML =
        "⏳ Publishing...";


    const { error } = await supabaseClient
        .from("produce")
        .insert([
            {
                crop: crop,
                quantity: Number(quantity),
                price: Number(price),
                location: location
            }
        ]);


    if (error) {

        document.getElementById("listing").innerHTML =
            "❌ Error: " + error.message;

        return;
    }


    document.getElementById("listing").innerHTML =
        "✅ Produce Published Successfully!<br><br>" +
        "🌾 Crop: " + crop + "<br>" +
        "📦 Quantity: " + quantity + " kg<br>" +
        "💰 Price: ₹" + price + "/kg<br>" +
        "📍 Location: " + location;
}


// ===============================
// SEARCH PRODUCE
// ===============================

async function searchProduce() {

    const crop =
        document.getElementById("searchCrop").value.trim();


    if (!crop) {

        document.getElementById("buyerResults").innerHTML =
            "⚠️ Please enter a crop name.";

        return;
    }


    document.getElementById("buyerResults").innerHTML =
        "⏳ Searching...";


    const { data, error } = await supabaseClient
        .from("produce")
        .select("*")
        .ilike("crop", "%" + crop + "%");


    if (error) {

        document.getElementById("buyerResults").innerHTML =
            "❌ Error: " + error.message;

        return;
    }


    if (!data || data.length === 0) {

        document.getElementById("buyerResults").innerHTML =
            "❌ No produce found.";

        return;
    }


    let result = "";


    data.forEach(function(item) {

        result +=
            "🌾 Crop: " + item.crop + "<br>" +
            "📦 Quantity: " + item.quantity + " kg<br>" +
            "💰 Price: ₹" + item.price + "/kg<br>" +
            "📍 Location: " + item.location +
            "<br><br>" +

            "<button onclick=\"makeOffer('" +
            item.crop +
            "')\">" +
            "🤝 Make Offer" +
            "</button>" +

            "<br><br>";

    });


    document.getElementById("buyerResults").innerHTML =
        result;
}


// ===============================
// MAKE OFFER
// ===============================

async function makeOffer(crop) {

    const offerPrice =
        prompt("Enter your offer price per kg:");

    const buyerName =
        prompt("Enter your name:");


    if (!offerPrice || !buyerName) {

        alert("Please enter all details.");

        return;
    }


    const { error } = await supabaseClient
        .from("offers")
        .insert([
            {
                crop: crop,
                offer_price: Number(offerPrice),
                buyer_name: buyerName
            }
        ]);


    if (error) {

        alert("❌ Error: " + error.message);

        return;
    }


    alert("✅ Offer sent successfully!");
}


// ===============================
// VIEW OFFERS
// ===============================

async function viewOffers() {

    const listing =
        document.getElementById("listing");


    listing.innerHTML =
        "⏳ Loading buyer offers...";


    const { data, error } = await supabaseClient
        .from("offers")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        listing.innerHTML =
            "❌ Error: " + error.message;

        return;
    }


    if (!data || data.length === 0) {

        listing.innerHTML =
            "📭 No offers received yet.";

        return;
    }


    let result =
        "<h3>🤝 Buyer Offers</h3><br>";


    data.forEach(function(offer) {

        result +=
            "🌾 Crop: " + offer.crop + "<br>" +
            "👤 Buyer: " + offer.buyer_name + "<br>" +
            "💰 Offer: ₹" +
            offer.offer_price +
            "/kg<br><br>";

    });


    listing.innerHTML = result;
}
function goHome() {

    document.getElementById("farmerDashboard").style.display = "none";

    document.getElementById("buyerDashboard").style.display = "none";

    document.getElementById("loginSection").style.display = "block";
}
