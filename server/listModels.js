// listModels.js
import axios from 'axios';

const apiKey = 'AIzaSyBFTenNYuydbsF2lmZC32470j_TiA1b3sI'; // your key

async function listModels() {
  try {
    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    console.log('\n✅ Available Models:\n');
    res.data.models.forEach((model) => {
      console.log(`🔹 ${model.name}`);
    });
  } catch (err) {
    console.error('\n❌ Error:\n', err.response?.data || err.message);
  }
}

listModels();
