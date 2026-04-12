/**
 * workshop-search.js
 *
 * A small React component that adds live filtering to the Workshop Types page.
 *
 * How it works:
 *   1. Django renders the workshop list into a hidden <div> (#wtype-rows-source).
 *   2. This script reads those DOM nodes on mount, pulling out the name/duration/id.
 *   3. As the user types, we just filter the array and re-render — no server calls.
 *
 * I went with React.createElement() directly (no JSX) so there's no build step.
 * It's a bit verbose but honestly fine for a single component like this.
 * React 18 is loaded from a CDN in the template.
 */

(function () {
  var h = React.createElement;
  var useState  = React.useState;
  var useEffect = React.useEffect;
  var useRef    = React.useRef;

  /**
   * Renders a single, rich workshop-type card with description + star rating.
   */
  function StarRating(props) {
    var rating = props.rating; // e.g. 4.5
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      var filled = i <= Math.floor(rating);
      var half   = !filled && (i - 0.5) <= rating;
      stars.push(h('span', {
        key: i,
        className: 'material-icons',
        style: {
          fontSize: '15px',
          color: (filled || half) ? '#f59e0b' : '#d1d5db',
          margin: '0 0.5px',
        },
      }, filled ? 'star' : (half ? 'star_half' : 'star_border')));
    }
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '2px' } },
      stars,
      h('span', { style: { fontSize: '11px', color: '#6b7280', marginLeft: '5px', fontWeight: 600 } },
        rating.toFixed(1) + ' / 5'
      )
    );
  }

  var CAT_ICON = {
    'Python':     'code',
    'Web':        'language',
    'Embedded':   'memory',
    'CFD':        'air',
    'VLSI':       'bolt',
    'Bio':        'biotech',
  };

  function getIcon(name) {
    var keys = Object.keys(CAT_ICON);
    for (var i = 0; i < keys.length; i++) {
      if (name.toLowerCase().indexOf(keys[i].toLowerCase()) !== -1) {
        return CAT_ICON[keys[i]];
      }
    }
    return 'school';
  }

  function WorkshopTypeCard(props) {
    var r = props.row;
    // parse the View Details link from the cached HTML
    var tmp = document.createElement('div');
    tmp.innerHTML = r.html;
    var link = tmp.querySelector('a');
    var detailUrl = link ? link.getAttribute('href') : '#';

    var icon = getIcon(r.name);

    return h('div', {
      className: 'wtype-card',
      style: { display: 'flex', flexDirection: 'column', height: '100%' },
    },
      // ── Gradient icon header ──
      h('div', {
        style: {
          background: 'linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-secondary) 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '18px 18px 14px',
          position: 'relative',
          overflow: 'hidden',
        },
      },
        // circle decoration
        h('div', { style: { position: 'absolute', top: -16, right: -16, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.1)' } }),
        // icon box
        h('div', {
          style: {
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          },
        },
          h('span', { className: 'material-icons', style: { fontSize: '22px', color: '#fff' } }, icon)
        ),
        // badge
        h('span', {
          style: {
            fontSize: 10, fontWeight: 700, color: '#fff',
            background: 'rgba(255,255,255,.25)',
            borderRadius: 20, padding: '2px 9px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          },
        }, 'Core'),
        // title
        h('h3', {
          className: 'wtype-title',
          style: { color: '#fff', margin: '8px 0 0', fontSize: '1rem', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,.2)' },
        }, r.name)
      ),

      // ── Body ──
      h('div', {
        style: {
          padding: '14px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--clr-surface-solid)',
        },
      },
        // Duration meta
        h('div', { className: 'wtype-meta', style: { fontSize: '13px', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 } },
          h('span', { className: 'material-icons', style: { fontSize: '15px' } }, 'schedule'),
          r.duration + ' day' + (r.duration === '1' ? '' : 's')
        ),

        // Star rating
        h(StarRating, { rating: r.rating }),

        // Description
        r.description && h('p', {
          style: {
            margin: 0,
            fontSize: '13px',
            color: 'var(--clr-text-muted)',
            lineHeight: 1.6,
            flex: 1,
          },
        }, r.description),

        // Divider
        h('hr', { style: { border: 'none', borderTop: '1px solid var(--clr-border)', margin: '4px 0' } }),

        // CTA
        h('a', {
          href: detailUrl,
          className: 'btn btn-outline-primary',
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontWeight: 600, fontSize: '13px',
          },
        },
          'View Details',
          h('span', { className: 'material-icons', style: { fontSize: '16px' } }, 'arrow_forward')
        )
      )
    );
  }

  /**
   * Main search + list component.
   * Reads workshop rows from a hidden source container in the DOM,
   * then provides a search input to filter them live.
   */
  function WorkshopSearch(props) {
    var container = document.getElementById(props.containerId);
    if (!container) return null;

    // pull the data out of the server-rendered HTML
    var rows = Array.from(container.querySelectorAll('[data-wtype-row]')).map(function (el) {
      return {
        id: el.dataset.id,
        name: el.dataset.name,
        duration: el.dataset.duration,
        description: el.dataset.description || '',
        rating: parseFloat(el.dataset.rating) || 4.0,
        html: el.outerHTML,
      };
    });

    var stateQuery = useState('');
    var query      = stateQuery[0];
    var setQuery   = stateQuery[1];

    var stateFiltered = useState(rows);
    var filtered      = stateFiltered[0];
    var setFiltered   = stateFiltered[1];

    var inputRef = useRef(null);

    // re-filter whenever the search query changes
    useEffect(function () {
      var q = query.trim().toLowerCase();
      if (q) {
        setFiltered(rows.filter(function (r) {
          return r.name.toLowerCase().indexOf(q) !== -1;
        }));
      } else {
        setFiltered(rows);
      }
    }, [query]);

    return h(React.Fragment, null,

      // --- Search bar ---
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '1rem', background: '#fff',
          border: '1.5px solid var(--clr-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          boxShadow: 'var(--shadow-sm)',
        },
      },
        h('span', {
          className: 'material-icons',
          style: { fontSize: '18px', color: 'var(--clr-text-muted)' },
        }, 'search'),

        h('input', {
          ref: inputRef,
          type: 'text',
          placeholder: 'Search workshop types\u2026',
          value: query,
          onChange: function (e) { setQuery(e.target.value); },
          style: {
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.9375rem', background: 'transparent',
            color: 'var(--clr-text)', padding: 0,
          },
          'aria-label': 'Search workshop types',
        }),

        // little "x" button to clear the search box
        query && h('button', {
          onClick: function () { setQuery(''); },
          style: {
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '0',
            color: 'var(--clr-text-muted)', lineHeight: 1,
          },
          'aria-label': 'Clear search',
        },
          h('span', { className: 'material-icons', style: { fontSize: '16px' } }, 'close')
        )
      ),

      // --- "Showing X of Y" counter while searching ---
      query && h('p', {
        style: { fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' },
      },
        filtered.length === 0
          ? 'No workshops match your search.'
          : 'Showing ' + filtered.length + ' of ' + rows.length + ' workshop type' + (rows.length !== 1 ? 's' : '')
      ),

      // --- Workshop rows (or empty state) ---
      (filtered.length === 0 && query)
        ? h('div', {
            style: { padding: '2.5rem', textAlign: 'center', color: 'var(--clr-text-muted)' },
          },
            h('span', {
              className: 'material-icons',
              style: { fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.35 },
            }, 'search_off'),
            h('p', { style: { margin: 0 } }, 'No results for "' + query + '"')
          )
        : h('div', { className: 'wtype-grid' },
            filtered.map(function (r) {
              return h(WorkshopTypeCard, { key: r.id, row: r });
            })
          )
    );
  }

  // --- Boot it up once the page is ready ---
  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('react-workshop-search');
    if (!mount) return;
    var root = ReactDOM.createRoot(mount);
    root.render(h(WorkshopSearch, { containerId: 'wtype-rows-source' }));
  });
})();
