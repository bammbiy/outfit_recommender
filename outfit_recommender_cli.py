import argparse
def recommend(temp_c, rainy, occasion='casual'):
    layers=[]; shoes='sneakers'; accessories=[]; top='t-shirt'; bottom='jeans'
    if temp_c>=30: top='linen shirt or breathable tee'; bottom='shorts'; shoes='sandals or breathable sneakers'; accessories.append('cap')
    elif 20<=temp_c<30: top='light tee or polo'; bottom='chinos or jeans'
    elif 10<=temp_c<20: top='long-sleeve + light jacket'; bottom='jeans'; layers.append('light jacket'); shoes='sneakers or boots'
    elif 0<=temp_c<10: top='sweater + coat'; bottom='thermal jeans or trousers'; layers.append('warm coat'); shoes='boots'; accessories+=['scarf']
    else: top='thermal base + heavy coat'; bottom='thermal trousers'; layers.append('down jacket'); shoes='insulated boots'; accessories+=['scarf','gloves','beanie']
    if rainy: layers.append('rain jacket'); accessories.append('umbrella'); shoes='waterproof '+shoes
    o=occasion.lower()
    if o in ['formal','office','work']: top='button-down shirt + blazer' if temp_c>=20 else 'knit + blazer'; bottom='trousers'; shoes='loafers' if not rainy else 'waterproof loafers'
    elif o in ['sport','gym']: top='moisture-wicking top'; bottom='athletic shorts' if temp_c>=15 else 'track pants'; shoes='trainers'
    return {'top':top,'bottom':bottom,'layers':layers,'shoes':shoes,'accessories':sorted(set(accessories))}
if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('--temp',type=float,required=True); ap.add_argument('--rainy',choices=['yes','no'],default='no'); ap.add_argument('--occasion',default='casual')
    a=ap.parse_args(); rec=recommend(a.temp, a.rainy=='yes', a.occasion); print('Recommendation:'); [print(f"- {k}: {v}") for k,v in rec.items()]
