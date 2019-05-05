## Example of using Google cloud function to create sitemap and upload to Google cloud storage.

## Prerequisite

This example assume:

1. You have Google cloud function and Google cloud storage enabled.
2. You have `gcloud` installed and have already authenticated using the CommandLine.

## Installation.

* npm install.

## Deploy(There is no need to put your GCP credentials).

1. Go to .env.yaml and change the `BUCKET_NAME` with your own Google cloud storage bucket name.
2. Run `npm run deploy` will automatically deploy the function to your google cloud if you have `gcloud` enabled on your computer.

## Production usage.

Should combine with Google Cloud Scheduler.

## Test Google cloud storage locally.

1. Create a file in root directory called `.env` and put your Google cloud storage bucket name as the following in there:
```
PROJECT_ID = ""; // yours
BUCKET_NAME = "" // yours
```
2. Download the file from your Google cloud storage containing the credentials and naming it "credentials.json" and put it at the root directory as well.
3. Run `npm start`

## Test everything locally.

Follow this [guide](https://cloud.google.com/functions/docs/emulator);

Change the `helloWorld` in the guide to `updateSitemap` is good enough.
