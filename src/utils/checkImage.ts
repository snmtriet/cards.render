import axios from "axios";

const timer = (timer: number) =>
  new Promise((res) =>
    setTimeout(() => {
      res(timer);
    }, timer)
  );

async function IsImageOk(
  collectionAddress: string,
  nftId: string | number,
  count: number
) {
  const img: any = document.getElementById(JSON.stringify(nftId));
  let ok = true;
  if (!img.complete) {
    ok = false;
  }
  if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
    ok = false;
  }
  if (!ok) {
    await timer(count * 500);
    axios({
      method: "GET",
      url: `https://api.opensea.io/api/v1/asset/${collectionAddress}/${nftId}`,
    }).then(({ data }) => {
      img.src = data.image_url;
      return data;
    });
  } else {
    return false;
  }
}

export default IsImageOk;
