from keras.models import load_model
from PIL import ImageOps, Image
import numpy as np

np.set_printoptions(suppress=True)

model = load_model("classifier.h5", compile=False)

def process(image):
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    image_array = np.asarray(image)

    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

    data[0] = normalized_image_array

    prediction = model.predict(data)
    index = np.argmax(prediction)
    confidence_score = prediction[0][index]

    return index, confidence_score