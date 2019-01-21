from style_transfer import load_image, transfer
from torchvision import models
import argparse, boto3, os, tempfile, torch, json
import torch.optim as optim

def main(style, content_key, request_id):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    s3 = boto3.resource('s3')
    bucket_name = os.environ.get('IMAGE_BUCKET_NAME')
    bucket = s3.Bucket(bucket_name)

    content_object = bucket.Object(content_key)
    content_tmp = tempfile.NamedTemporaryFile()
    with open(content_tmp.name, 'wb') as f:
        content_object.download_fileobj(f)
    content = load_image(content_tmp.name).to(device)

    style_key = 'style/%s.jpg' % style
    style_object = bucket.Object(style_key)
    style_tmp = tempfile.NamedTemporaryFile()
    with open(style_tmp.name, 'wb') as f:
        style_object.download_fileobj(f)
    # Resize style to match content, makes code easier
    style = load_image(style_tmp.name, shape=content.shape[-2:]).to(device)

    # get the "features" portion of VGG19 (we will not need the "classifier" portion)
    vgg = models.vgg19(pretrained=True).features

    # freeze all VGG parameters since we're only optimizing the target image
    for param in vgg.parameters():
        param.requires_grad_(False)

    vgg.to(device)

    # weights for each style layer
    # weighting earlier layers more will result in *larger* style artifacts
    # notice we are excluding `conv4_2` our content representation
    style_weights = {
        'conv1_1': 1.,
        'conv2_1': 0.8,
        'conv3_1': 0.5,
        'conv4_1': 0.3,
        'conv5_1': 0.1,
    }

    # you may choose to leave these as is
    content_weight = 1  # alpha
    style_weight = 1e6  # beta

    # iteration hyperparameters
    optimizer = optim.Adam
    steps = 2000  # decide how many iterations to update your image (5000)

    # for displaying the target image, intermittently
    show_every = 400

    result = transfer(
        device,
        style,
        content,
        vgg,
        content_weight,
        style_weight,
        style_weights,
        optimizer,
        steps,
    )
    result_tmp = tempfile.NamedTemporaryFile()
    result.save(result_tmp.name)
    result_key = content_key.replace('/input/', '/output/')

    with open(result_tmp.name, 'rb') as result:
        s3.put_object(
            Bucket=bucket_name,
            Key=result_key,
            Body=result,
        )

    sqs = boto3.client('sqs')
    result_message = {
        'requestId': request_id,
        'resultKey': result_key,
    }
    sqs.send_message(
        QueueUrl=os.environ.get('JOB_DONE_QUEUE_URL'),
        MessageBody=json.dumps(result_message),
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description = 'Run the style transfer algorithm on a pair of images.')

    parser.add_argument(
        'content_key', metavar='CONTENT_IMAGE_KEY',
        type=str, help='object key of the content image'
    )
    parser.add_argument(
        '-s', '--style', metavar='STYLE_IMAGE',
        type=str, dest='style', default='starry-night',
        help='name of the style image'
    )
    parser.add_argument(
        '-r', '--request-id', metavar='REQUEST_ID',
        type=str, dest='request_id', required=True,
        help='unique ID for the request'
    )

    args = parser.parse_args()

    main(args.style, args.content_key, args.request_id)
