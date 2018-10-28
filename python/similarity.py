import tensorflow as tf
import tensorflow_hub as hub
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import re
import seaborn as sns

# Install the PyDrive wrapper & import libraries.
# This only needs to be done once per notebook.
!pip install -U -q PyDrive
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from google.colab import auth
from oauth2client.client import GoogleCredentials

# Authenticate and create the PyDrive client.
# This only needs to be done once per notebook.
auth.authenticate_user()
gauth = GoogleAuth()
gauth.credentials = GoogleCredentials.get_application_default()
drive = GoogleDrive(gauth)

# List .txt files in the root.
#
# Search query reference:
# https://developers.google.com/drive/v2/web/search-parameters
file_id = '10Nb8L7imXDrUVlwdYIYd8QHNqNGSQhob'
downloaded = drive.CreateFile({'id': file_id})
recipes = downloaded.GetContentString().split("\r\n")

module_url = "https://tfhub.dev/google/universal-sentence-encoder/2"

# Import the Universal Sentence Encoder's TF Hub module
embed = hub.Module(module_url)

def run_and_plot(session_, input_tensor_, messages_, encoding_tensor):
  message_embeddings_ = session_.run(
      encoding_tensor, feed_dict={input_tensor_: messages_})
  plot_similarity(messages_, message_embeddings_, 90)

messages = ["Chicken with Rice"] + recipes
similarity_input_placeholder = tf.placeholder(tf.string, shape=(None))
similarity_message_encodings = embed(similarity_input_placeholder)
with tf.Session() as session:
  session.run(tf.global_variables_initializer())
  session.run(tf.tables_initializer())
  message_embeddings_ = session.run(
      similarity_message_encodings, feed_dict={similarity_input_placeholder: messages})
  similarityArray = np.inner(message_embeddings_, message_embeddings_)[0][1:].tolist()
  sortedArray = similarityArray.copy()
  sortedArray.sort()
  sortedArray.reverse()
  for i in range(5):
    print(recipes[similarityArray.index(sortedArray[i])])