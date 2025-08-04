// utils/embedding/embedCourses.js

import * as tf from '@tensorflow/tfjs-node';

const run = async () => {
  const courseTitles = [
    "Full Stack Web Development",
    "Data Science with Python",
    "Machine Learning Essentials",
    "JavaScript Basics"
  ];

  // Convert each title to numeric embeddings (very basic example)
  const embeddings = courseTitles.map(title => {
    const charCodes = Array.from(title).map(ch => ch.charCodeAt(0));
    return tf.tensor1d(charCodes);
  });

  embeddings.forEach((tensor, i) => {
    console.log(`Embedding for "${courseTitles[i]}":`);
    tensor.print();
  });
};

run();
