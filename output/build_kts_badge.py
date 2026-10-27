from PIL import Image
import numpy as np
from pathlib import Path

OUT=Path(__file__).parent/'kts-brand-assets'
OUT.mkdir(exist_ok=True)
im=np.array(Image.open(r'C:\Users\dell\Pictures\Screenshots\KTS Digital Solutions Badge.png').convert('RGB'))
mask=(im[:,:,0]<75)&(im[:,:,1]<75)&(im[:,:,2]<75)
mask[:170]=False
mask[1075:]=False
mask[:,:240]=False
mask[:,960:]=False
# Trace exposed pixel edges, retaining all counters in the original lettering.
edges={}
for y,x in np.argwhere(mask):
    for dy,dx,a,b in [(-1,0,(x,y),(x+1,y)),(0,1,(x+1,y),(x+1,y+1)),(1,0,(x+1,y+1),(x,y+1)),(0,-1,(x,y+1),(x,y))]:
        if not mask[y+dy,x+dx]: edges.setdefault(a,[]).append(b)
def simplify(p,eps=.65):
    if len(p)<3:return p
    a,b=np.array(p[0]),np.array(p[-1]); v=b-a
    q=np.array(p); d=np.linalg.norm(q-a,axis=1) if not np.any(v) else np.abs(v[0]*(q[:,1]-a[1])-v[1]*(q[:,0]-a[0]))/np.linalg.norm(v)
    k=int(np.argmax(d))
    if d[k]<=eps:return [p[0],p[-1]]
    return simplify(p[:k+1],eps)[:-1]+simplify(p[k:],eps)
paths=[]
while edges:
    start=next(iter(edges)); p=[start]; cur=start
    while True:
        nxt=edges[cur].pop()
        if not edges[cur]:del edges[cur]
        cur=nxt
        if cur==start:break
        p.append(cur)
    if len(p)<30:continue
    p=simplify(p+[start])[:-1]
    # Rounded subpixel joins soften raster stair steps without changing the silhouette.
    mids=[((p[i][0]+p[(i+1)%len(p)][0])/2,(p[i][1]+p[(i+1)%len(p)][1])/2) for i in range(len(p))]
    d=f'M{mids[-1][0]:g},{mids[-1][1]:g} '
    d='M'+' L'.join(f'{x},{y}' for x,y in p)+' Z'
    paths.append(d)
defs='''<defs><linearGradient id="teal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00c9aa"/><stop offset=".48" stop-color="#008a7d"/><stop offset=".76" stop-color="#003d39"/><stop offset="1" stop-color="#00c9b2"/></linearGradient><linearGradient id="bar" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00bda0"/><stop offset="1" stop-color="#009c87"/></linearGradient><linearGradient id="ink" x2=".7" y2="1"><stop stop-color="#151819"/><stop offset="1" stop-color="#050808"/></linearGradient></defs>'''
body='<circle cx="626" cy="623" r="582" fill="none" stroke="url(#teal)" stroke-width="49"/>'
body+='<path fill="url(#ink)" fill-rule="evenodd" d="'+' '.join(paths)+'"/>'
body+='<rect x="447" y="349" width="170" height="307" rx="85" fill="url(#bar)"/><path d="M796 222L833 189" fill="none" stroke="white" stroke-width="47" stroke-linecap="round"/><path d="M796 222L833 189" fill="none" stroke="url(#bar)" stroke-width="44" stroke-linecap="round"/>'
for name,bg in [('kts-digital-solutions-premium.svg',''),('kts-digital-solutions-white.svg','<rect width="1254" height="1254" fill="#fff"/>')]:
    (OUT/name).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254" viewBox="0 0 1254 1254" role="img" aria-labelledby="title"><title id="title">KTS Digital Solutions</title>'+defs+bg+body+'</svg>',encoding='utf-8')
print(OUT)

