# Builds web images from /workspace/bt-quail/up (EDSR x4 upscales of the public FB images)
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import numpy as np, json, os
UP='/workspace/bt-quail/up/'; OUT='/workspace/bt-quail/site/assets/img/'
INK=np.array([42,31,22]); CREAM=np.array([243,233,213])
rng=np.random.default_rng(7)
def grain(a, amt=7):
    n=rng.normal(0,amt,a.shape[:2])[...,None]; return np.clip(a+n,0,255)
MID=np.array([150,112,74])
def duotone(im, contrast=1.22):
    g=np.array(ImageOps.autocontrast(im.convert('L'),cutoff=2)).astype(float)/255
    g=np.clip((g-.5)*contrast+.5,0,1)[...,None]
    lo=INK+(MID-INK)*np.clip(g/.55,0,1); hi=MID+(CREAM-MID)*np.clip((g-.55)/.45,0,1)
    out=np.where(g<.55,lo,hi)
    return Image.fromarray(grain(out,6).clip(0,255).astype('uint8'))
def warm(im):
    im=ImageEnhance.Color(im).enhance(.82); a=np.array(im).astype(float)
    a=a*np.array([1.03,1.0,.93]); return Image.fromarray(grain(a,4).clip(0,255).astype('uint8'))
dims={}
def save(im,name,q=82):
    im.save(OUT+name+'.webp','WEBP',quality=q,method=6); dims[name]=im.size
def soft(im): return im.filter(ImageFilter.UnsharpMask(radius=1.4,percent=60,threshold=2))
cover=Image.open(UP+'cover.png').convert('RGB')
# hero bird crop (clean area, above the brand band, left of seal)
hero=cover.crop((1960,0,3110,1250)); save(soft(hero),'hero-quail',84)
save(soft(hero).resize((620,int(620*1250/1150)),Image.LANCZOS),'hero-quail-s',82)
# cover field strip (left, no lettering) for textures
field=cover.crop((0,0,560,1250)); save(field.resize((448,1000),Image.LANCZOS),'field',70)
# full cover for gallery
save(cover.resize((1920,764),Image.LANCZOS),'cover',84)
photos={'hand-wing':'quail-hand-1','hand-wing-2':'quail-hand-2','hand-head':'quail-hand-3','hand-profile':'quail-profile-1',
 'trays':'incubator-trays','trays-2':'incubator-trays-2','hatcher':'hatcher-eggs','egg-flats':'incubator-farm','thanks-50k':'promo-followers'}
for k,v in photos.items():
    im=Image.open(UP+v+'.png').convert('RGB'); w,h=im.size; s=min(w,h); im=im.crop(((w-s)//2,(h-s)//2,(w-s)//2+s,(h-s)//2+s))
    im=soft(im); save(duotone(im),'p-'+k); save(warm(im),'c-'+k)
vid=Image.open(UP+'hatcher-video-preview.png').convert('RGB')
# remove nothing; crop away play button area is impossible -> use lower part showing trays & eggs
lower=vid.crop((0,560,1088,1252)); save(duotone(soft(lower)),'p-hatcher-video'); save(warm(soft(lower)),'c-hatcher-video')
json.dump(dims,open('/workspace/bt-quail/site/_build/dims.json','w'),indent=0)
print(dims)
# Panorama: the bird crop from their cover, with its own hazy field background stretched left (blurred) so live text can sit where the cover lettering was
bird=soft(cover.crop((1900,0,3110,1250)))
edge=bird.crop((0,0,170,1250)).resize((1700,1250),Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
far=cover.crop((0,0,560,1250)).resize((1700,1250),Image.BICUBIC).filter(ImageFilter.GaussianBlur(16))
gm=np.clip(np.linspace(-0.2,1.0,1700),0,1)[None,:,None]
left=Image.fromarray((np.array(far).astype(float)*(1-gm)+np.array(edge).astype(float)*gm).astype('uint8'))
pano=Image.new('RGB',(2700,1250)); pano.paste(left,(0,0)); pano.paste(left.crop((1500,0,1700,1250)).resize((400,1250)),(1600,0))
m=np.clip(np.arange(bird.size[0])/260,0,1); m=np.tile(m,(1250,1))*255
pano.paste(bird,(2700-bird.size[0],0),Image.fromarray(m.astype('uint8')))
pa=np.array(pano).astype(float); pano=Image.fromarray(grain(pa,3).clip(0,255).astype('uint8'))
save(pano.resize((2400,1111),Image.LANCZOS),'pano',82); save(pano.resize((1200,556),Image.LANCZOS),'pano-s',80)
json.dump(dims,open('/workspace/bt-quail/site/_build/dims.json','w'),indent=0)
